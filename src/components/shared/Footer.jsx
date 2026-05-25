import { siteConfig } from "@/lib/site";

const Footer = () => {
  return (
    <footer className="footer footer-center border-t border-base-300 bg-base-100 px-4 py-6 text-base-content sm:footer-horizontal">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - {siteConfig.name}. Built for
          focused crypto campaign tracking.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
