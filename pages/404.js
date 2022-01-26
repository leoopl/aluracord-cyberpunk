import Link from "next/link";
import { Box } from "@skynexui/components";

export default function Custom404() {
	return (
		<>
			<Box
				styleSheet={{
					textAlign: "center",
					backgroundImage: "url(/404.gif)",
				}}
			>
				<Link href="/">
					<a>Go back to home</a>
				</Link>
			</Box>
		</>
	);
}
