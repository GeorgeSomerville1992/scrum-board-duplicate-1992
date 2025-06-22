import { Link } from 'react-router';

function NotFound() {
  return (
    <section className="flex items-center flex-col justify-between">
      <h1 className="text-9xl">404</h1>
      <p className="absolute bottom-20">
        Take me back to <Link to="/">Home</Link>
      </p>
    </section>
  );
}

export default NotFound;
