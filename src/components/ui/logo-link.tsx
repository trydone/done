import Link from "next/link";
import { ConditionalWrapper } from "./conditional-wrapper";

type Props = {
  href?: string;
  hasLink?: boolean;
  showWordmark?: boolean;
  className?: string;
};

export const LogoLink = ({
  href = "/",
  hasLink = true,
  showWordmark = true,
  className,
}: Props) => {
  return (
    <ConditionalWrapper
      condition={hasLink}
      wrapper={(children) => (
        <Link href={href} className="flex items-center">
          {children}
        </Link>
      )}
    >
      <span className="font-black">Done</span>
    </ConditionalWrapper>
  );
};
