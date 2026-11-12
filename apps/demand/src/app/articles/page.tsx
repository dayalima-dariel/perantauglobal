import { permanentRedirect } from "next/navigation";

export default function LegacyArticlesIndex() {
  permanentRedirect("/en/articles");
}

