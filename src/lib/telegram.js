const TELEGRAM_HOSTS = new Set(["t.me", "telegram.me", "telegram.dog", "www.t.me"]);

function decodeHtmlEntities(text) {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(text) {
  return decodeHtmlEntities(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function matchFirstGroup(source, pattern) {
  const match = source.match(pattern);
  return match?.[1] ? stripTags(match[1]) : null;
}

function collectMatches(source, pattern) {
  return Array.from(source.matchAll(pattern))
    .map((match) => (match?.[1] ? stripTags(match[1]) : null))
    .filter(Boolean);
}

export function parseTelegramMessageLink(link) {
  let url;

  try {
    url = new URL(link);
  } catch {
    return {
      ok: false,
      message: "Enter a valid URL before fetching from Telegram.",
    };
  }

  if (!TELEGRAM_HOSTS.has(url.hostname)) {
    return {
      ok: false,
      message: "Only public Telegram post links are supported.",
    };
  }

  const segments = url.pathname.split("/").filter(Boolean);

  const normalizedSegments = segments[0] === "s" ? segments.slice(1) : segments;

  if (normalizedSegments[0] === "c") {
    return {
      ok: false,
      message: "Private Telegram post links are not supported yet.",
    };
  }

  if (normalizedSegments.length < 2) {
    return {
      ok: false,
      message: "Use a public Telegram post link like https://t.me/channel/123.",
    };
  }

  const username = normalizedSegments[0];
  const postId = normalizedSegments[1];

  if (!/^[A-Za-z0-9_]{5,}$/.test(username) || !/^\d+$/.test(postId)) {
    return {
      ok: false,
      message: "Use a public Telegram message URL like https://t.me/channel/123.",
    };
  }

  return {
    ok: true,
    username,
    postId,
    canonicalUrl: `https://t.me/${username}/${postId}`,
    embedUrl: `https://t.me/${username}/${postId}?embed=1&mode=tme`,
  };
}

export function isSupportedTelegramMessageLink(link) {
  return parseTelegramMessageLink(link).ok;
}

export function deriveNameFromTelegramPost(postText) {
  const firstLine = postText
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !/^https?:\/\//i.test(line));

  if (!firstLine) {
    return null;
  }

  if (firstLine.length > 100) {
    return null;
  }

  return firstLine;
}

export async function fetchTelegramPostText(link) {
  const parsed = parseTelegramMessageLink(link);

  if (!parsed.ok) {
    throw new Error(parsed.message);
  }

  const response = await fetch(parsed.embedUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Telegram post could not be fetched.");
  }

  const html = await response.text();
  const messageText =
    matchFirstGroup(
      html,
      /<div class="tgme_widget_message_text[^"]*js-message_text[^"]*">([\s\S]*?)<\/div>/i,
    ) ||
    matchFirstGroup(
      html,
      /<div class="tgme_widget_message_text[^"]*">([\s\S]*?)<\/div>/i,
    );

  const previewTitle = matchFirstGroup(
    html,
    /<div class="link_preview_title"[^>]*>([\s\S]*?)<\/div>/i,
  );
  const previewDescription = matchFirstGroup(
    html,
    /<div class="link_preview_description"[^>]*>([\s\S]*?)<\/div>/i,
  );
  const messageMeta = collectMatches(
    html,
    /<(?:div|span) class="tgme_widget_message_[^"]*"[^>]*>([\s\S]*?)<\/(?:div|span)>/gi,
  );

  const fallbackParts = [messageText, previewTitle, previewDescription, ...messageMeta]
    .map((value) => value?.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);

  const combinedText = fallbackParts.join("\n\n").trim();

  if (!combinedText) {
    throw new Error(
      "Could not read this Telegram message. Make sure the post is public and has readable text.",
    );
  }

  return {
    ...parsed,
    postText: combinedText,
  };
}
