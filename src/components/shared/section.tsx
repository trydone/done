export const Section = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2 px-2">
      {children}
    </div>
  );
}