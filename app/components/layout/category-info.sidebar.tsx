import Link from "next/link";

const CategoryInfoSidebar = () => {
  const isLoggedIn = true;
  return (
    <aside className="w-80 p-4 flex-col hidden xl:flex sticky top-0 h-screen">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="bg-indigo-500 h-16"></div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-white">Category Info</h2>
          <p className="text-sm text-gray-400 mt-2">
            Community for everything related to categories....
          </p>
          <div className="flex gap-8 mt-4 border-t border-t-gray-700 pt-4">
            <div>
              <div className="text-lg font-bold text-white">1.2M</div>
              <div className="text-sm text-gray-400">Reviews</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">1.2M</div>
              <div className="text-sm text-gray-400">Members</div>
            </div>
          </div>

          {isLoggedIn && (
            <Link
              href="/create"
              className="block mt-4 text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-full text-sm"
            >
              Write a review
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CategoryInfoSidebar;
