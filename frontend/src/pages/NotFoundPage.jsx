import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="grid min-h-screen place-items-center p-6 text-center">
    <div className="ui-panel max-w-md p-8">
      <h1 className="text-5xl font-bold text-fuchsia-300">404</h1>
      <p className="ui-muted mt-2">The shelf you are looking for does not exist.</p>
      <Link to="/books" className="ui-btn-primary mt-4 inline-block">
        Back to Library
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
