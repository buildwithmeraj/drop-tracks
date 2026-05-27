import { siteConfig } from "@/lib/site";
import { signIn } from "@/auth";
import Alert from "@/components/alerts/Alert";
import LoginSubmitButton from "@/components/auth/LoginSubmitButton";

const Login = ({ message, callbackUrl = "/dashboard" }) => {
  return (
    <div className="flex flex-col min-h-[77vh] justify-center items-center">
      <div className="card max-w-sm bg-base-200/40 shadow-md backdrop-blur-xs px-4">
        <div className="card-body">
          <h2 className="font-bold text-2xl text-center my-2">
            Account <span className="text-primary">Login</span>
          </h2>
          {message ? (
            <Alert message={message} />
          ) : (
            <p className="text-center my-2">
              To access the features of the {siteConfig.name}, please login with
              your google account.
            </p>
          )}
          <form
            className="mt-4 flex justify-center items-center"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <LoginSubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
