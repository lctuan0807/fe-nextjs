import Verify from "./verify";

const VerifyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">@lctuan Next.js</h1>
          <p className="text-gray-400">Sign up to get started</p>
        </div>
        <Verify id={Number(id)} />
      </div>
    </div>
  );
};

export default VerifyPage;
