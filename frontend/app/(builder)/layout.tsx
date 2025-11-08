/**
 * @FeatureID Foundation
 * @Purpose Builder layout with header
 * @Author Chat Bot Labs
 */

import { Header } from "@/components/layout/Header";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

