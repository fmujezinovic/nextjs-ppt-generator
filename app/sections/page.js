import { Suspense } from "react";
import SectionsPageInner from "./SectionsPageInner";

export default function SectionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SectionsPageInner />
    </Suspense>
  );
}
