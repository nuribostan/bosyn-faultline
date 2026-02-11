import Link from "next/link";

const Logo = () => {
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME;

  return (
    <Link href="/" id="logo" className="flex flex-col ">
      <h1 className="text-4xl text-side-bar-foreground capitalize font-bold">
        {APP_NAME}
      </h1>
      <h1 className="text-lg text-side-bar-foreground uppercase">
        {COMPANY_NAME}
      </h1>
    </Link>
  );
};

export default Logo;
