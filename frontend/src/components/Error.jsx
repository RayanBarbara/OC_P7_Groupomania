import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

function Error() {
  return (
    <div id="errorContainer">

      <Helmet>
        <meta charSet="utf-8" />
        <title>Settings</title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="This is the error page where the user is redirect when inputting a wrong URL!" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="error">
        <h1 className="error__title">Error 404: Page not found</h1>
        <p className="error__text">
          Sorry, the page you're looking for cannot be accessed! <br /> Click{" "} <Link className="links" to="/login">here</Link>{" "} to return to the <b>login page</b>!
        </p>
      </div>

    </div>
  );
}

export default Error;
