import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center">
    <div>
      <h1 className="text-5xl font-bold text-amber-300">404</h1>
      <p className="mt-2 text-slate-300">The shelf you are looking for does not exist.</p>
      <Link to="/books" className="mt-4 inline-block rounded-lg bg-amber-400 px-4 py-2 font-medium text-slate-900">
        Back to Library
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
