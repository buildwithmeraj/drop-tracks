import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

const AIRDROPS_COLLECTION = "airdrops";
const DEFAULT_PAGE_SIZE = 10;

function toUserIdValue(userId) {
  if (typeof userId === "string" && ObjectId.isValid(userId)) {
    return new ObjectId(userId);
  }

  return userId;
}

function toObjectId(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeLowercase(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeWallet(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeDate(value) {
  const text = normalizeText(value);

  if (!text) {
    return null;
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getValue(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function sanitizeAccounts(rawAccounts, multiple) {
  const accounts = rawAccounts
    .map((account, index) => {
      const username = normalizeText(account.username);
      const email = normalizeLowercase(account.email);
      const wallet = normalizeWallet(account.wallet);
      const label = normalizeText(account.label);

      if (!username && !email && !wallet) {
        return null;
      }

      return {
        id: account.id || `account-${index + 1}`,
        label,
        username,
        email,
        wallet,
      };
    })
    .filter(Boolean);

  if (!multiple && accounts.length > 1) {
    return [accounts[0]];
  }

  return accounts;
}

function validateAccounts(accounts) {
  if (!accounts.length) {
    return "Add at least one identifier using username, email, or EVM wallet.";
  }

  for (const account of accounts) {
    if (!account.username && !account.email && !account.wallet) {
      return "Each account row must include a username, email, or EVM wallet.";
    }

    if (
      account.wallet &&
      !/^0x[a-f0-9]{40}$/i.test(account.wallet)
    ) {
      return "EVM wallets must look like a valid 0x address.";
    }
  }

  return null;
}

function buildAirdropPayload(formData) {
  const name = normalizeText(getValue(formData, "name"));
  const link = normalizeText(getValue(formData, "link"));
  const notes = normalizeText(getValue(formData, "notes"));
  const multiple = formData.get("multiple") === "on";
  const needsDailyTasks = formData.get("needsDailyTasks") === "on";

  let rawAccounts = [];

  try {
    rawAccounts = JSON.parse(getValue(formData, "accounts") || "[]");
  } catch {
    return { error: "Account data could not be parsed." };
  }
  const accounts = sanitizeAccounts(rawAccounts, multiple);

  if (!name) {
    return { error: "Airdrop name is required." };
  }

  if (!link) {
    return { error: "Airdrop link is required." };
  }

  try {
    new URL(link);
  } catch {
    return { error: "Airdrop link must be a valid URL." };
  }

  const accountError = validateAccounts(accounts);
  if (accountError) {
    return { error: accountError };
  }

  const endDate = normalizeDate(getValue(formData, "endDate"));
  const expectedPaymentDate = normalizeDate(getValue(formData, "expectedPaymentDate"));
  const expectedTgeDate = normalizeDate(getValue(formData, "expectedTgeDate"));

  return {
    payload: {
      name,
      link,
      notes,
      multiple,
      needsDailyTasks,
      accounts,
      endDate,
      expectedPaymentDate,
      expectedTgeDate,
    },
  };
}

function createUserFilter(userId) {
  return { userId: toUserIdValue(userId) };
}

function createAirdropSearchFilter(search) {
  const query = normalizeText(search);

  if (!query) {
    return null;
  }

  const safeQuery = escapeRegExp(query);

  return {
    $or: [
      { name: { $regex: safeQuery, $options: "i" } },
      { link: { $regex: safeQuery, $options: "i" } },
      { notes: { $regex: safeQuery, $options: "i" } },
      { "accounts.label": { $regex: safeQuery, $options: "i" } },
      { "accounts.username": { $regex: safeQuery, $options: "i" } },
      { "accounts.email": { $regex: safeQuery, $options: "i" } },
      { "accounts.wallet": { $regex: safeQuery, $options: "i" } },
    ],
  };
}

async function getCollection() {
  const db = await getDatabase();
  return db.collection(AIRDROPS_COLLECTION);
}

export async function listAirdropsByUser(
  userId,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  search = "",
) {
  const collection = await getCollection();
  const safePage = Math.max(1, Number(page) || 1);
  const skip = (safePage - 1) * pageSize;
  const searchFilter = createAirdropSearchFilter(search);
  const filter = searchFilter
    ? {
        ...createUserFilter(userId),
        ...searchFilter,
      }
    : createUserFilter(userId);

  const [items, totalItems] = await Promise.all([
    collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    items: items.map(serializeAirdrop),
    pagination: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
    search: normalizeText(search),
  };
}

export async function getAirdropByIdForUser(userId, id) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return null;
  }

  const collection = await getCollection();
  const item = await collection.findOne({
    _id: objectId,
    ...createUserFilter(userId),
  });

  return item ? serializeAirdrop(item) : null;
}

function formatEvent(type, dateField, item) {
  if (!item[dateField]) {
    return null;
  }

  return {
    id: `${item._id}-${type}`,
    type,
    name: item.name,
    date: item[dateField],
    href: `/dashboard/airdrops/update/${item._id}`,
  };
}

export async function getDashboardAirdropOverview(userId) {
  const collection = await getCollection();
  const items = await collection
    .find(createUserFilter(userId))
    .sort({ createdAt: -1 })
    .toArray();

  const now = new Date();
  const next14Days = new Date(now);
  next14Days.setDate(next14Days.getDate() + 14);

  const serializedItems = items.map(serializeAirdrop);
  const upcomingPayments = serializedItems.filter(
    (item) => item.expectedPaymentDate && new Date(item.expectedPaymentDate) >= now,
  );
  const upcomingTges = serializedItems.filter(
    (item) => item.expectedTgeDate && new Date(item.expectedTgeDate) >= now,
  );
  const endingSoon = serializedItems.filter((item) => {
    if (!item.endDate) {
      return false;
    }

    const endDate = new Date(item.endDate);
    return endDate >= now && endDate <= next14Days;
  });

  const timeline = serializedItems
    .flatMap((item) => [
      formatEvent("payment", "expectedPaymentDate", item),
      formatEvent("tge", "expectedTgeDate", item),
      formatEvent("end", "endDate", item),
    ])
    .filter(Boolean)
    .filter((item) => new Date(item.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  return {
    stats: {
      totalTracked: serializedItems.length,
      upcomingPayments: upcomingPayments.length,
      upcomingTges: upcomingTges.length,
      endingSoon: endingSoon.length,
      multipleAccounts: serializedItems.filter((item) => item.multiple).length,
      dailyTasks: serializedItems.filter((item) => item.needsDailyTasks).length,
    },
    recentAirdrops: serializedItems.slice(0, 5),
    timeline,
    dailyTaskAirdrops: serializedItems.filter((item) => item.needsDailyTasks).slice(0, 6),
  };
}

export async function createAirdropForUser(userId, formData) {
  const parsed = buildAirdropPayload(formData);
  if (parsed.error) {
    return { ok: false, message: parsed.error };
  }

  const now = new Date();
  const collection = await getCollection();

  await collection.insertOne({
    userId: toUserIdValue(userId),
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
    ...parsed.payload,
  });

  return { ok: true, message: "Airdrop added successfully." };
}

export async function updateAirdropForUser(userId, id, formData) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return { ok: false, message: "Invalid airdrop id." };
  }

  const parsed = buildAirdropPayload(formData);
  if (parsed.error) {
    return { ok: false, message: parsed.error };
  }

  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: objectId, ...createUserFilter(userId) },
    {
      $set: {
        ...parsed.payload,
        updatedAt: new Date(),
      },
    },
  );

  if (!result.matchedCount) {
    return { ok: false, message: "Airdrop not found." };
  }

  return { ok: true, message: "Airdrop updated successfully." };
}

export async function deleteAirdropForUser(userId, id) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return { ok: false, message: "Invalid airdrop id." };
  }

  const collection = await getCollection();
  const result = await collection.deleteOne({
    _id: objectId,
    ...createUserFilter(userId),
  });

  if (!result.deletedCount) {
    return { ok: false, message: "Airdrop not found." };
  }

  return { ok: true, message: "Airdrop deleted successfully." };
}

export function serializeAirdrop(item) {
  return {
    _id: item._id.toString(),
    userId:
      typeof item.userId?.toString === "function"
        ? item.userId.toString()
        : item.userId,
    name: item.name,
    link: item.link,
    notes: item.notes || "",
    multiple: Boolean(item.multiple),
    needsDailyTasks: Boolean(item.needsDailyTasks),
    accounts: Array.isArray(item.accounts) ? item.accounts : [],
    joinedAt: item.joinedAt ? item.joinedAt.toISOString() : null,
    endDate: item.endDate ? item.endDate.toISOString() : null,
    expectedPaymentDate: item.expectedPaymentDate
      ? item.expectedPaymentDate.toISOString()
      : null,
    expectedTgeDate: item.expectedTgeDate
      ? item.expectedTgeDate.toISOString()
      : null,
    createdAt: item.createdAt ? item.createdAt.toISOString() : null,
    updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
  };
}
