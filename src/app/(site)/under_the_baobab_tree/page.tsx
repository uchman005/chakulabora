import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Under the Baobab Tree",
  description: "Under the Baobab Tree — stories and conversations from the Chakula Bora Network community.",
  path: "/under_the_baobab_tree",
});

export default function UnderTheBaobabTreePage() {
  return (
    <>
      <PageBackground src="/baobab.jpg" />
      <div className="min-h-[95vh]">
        <h1 className="sr-only">Under the Baobab Tree</h1>
      </div>
    </>
  );
}
