import { Form, Skeleton } from "antd";
import type { FormProps } from "antd";
import { ReactNode } from "react";

type Props = FormProps & {
  loading: boolean;
  children: ReactNode;
};

export default function FormWithSkeleton({
  loading,
  children,
  ...formProps
}: Props) {
  if (loading) return <Skeleton className="py-8" />;

  return <Form {...formProps}>{children}</Form>;
}
