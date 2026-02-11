const PageTitle = ({ title, subTitle }: { title: string, subTitle?: string }) => {
  return (
    <div className="pageTitle">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <h4 className={subTitle ? "text-lg" : "hidden"}>{subTitle}</h4>
    </div>
  );
};

export default PageTitle;
