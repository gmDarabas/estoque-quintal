import { usePageTitle } from "@/layouts/admin-layout/providers/page-title-context";
import { PageHeader, PageHeaderProps } from "@ant-design/pro-components";
import { Grid } from "antd";
import Title from "antd/es/typography/Title";

const { useBreakpoint } = Grid;

export default function DefaultPageHeader({ children, title, onBack, ...props }: PageHeaderProps) {
	const { setPageTitle } = usePageTitle('', !!onBack);

	if (typeof title === "string") {
		setPageTitle(title);
	}

	const screens = useBreakpoint();
	const isMobile = screens.xs;

	const titleComponent = () => isMobile ? undefined : <Title level={2} style={{ marginBottom: 5 }}>{title}</Title>

	return (
		<PageHeader {...props} title={titleComponent()} onBack={isMobile ? undefined : onBack}>{children}</PageHeader>
	);
}
