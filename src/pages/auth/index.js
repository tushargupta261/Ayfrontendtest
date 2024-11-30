import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Login, Signup } from "../../api";
import { useRouter } from "next/router";
import userAuth from "../../util/user-auth";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email should not be empty"),
  password: Yup.string().required("Password should not be empty"),
});

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [session, loading] = userAuth();

  const router = useRouter();

  if (session) {
    router.push("/");
  }

  const handleSubmit = async (values) => {
    console.log(values,isLogin,'values');
    if (isLogin) {
      const response = await Login(values);
      localStorage.setItem("auth_token", response.data.authToken);
    } else {
      const response = await Signup(values);
      localStorage.setItem("auth_token", response.data.authToken);
    }
  };

  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 h-[70vh] p-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {isLogin ? "Login" : "Signup"}
          </h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john.doe@company.com"
                  className="input"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="•••••••••"
                  className="input"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <button type="submit" className="button">
                {isLogin ? "Login" : "Signup"}
              </button>
            </Form>
          </Formik>
          <p className="flex flex-col gap-2 mt-4 text-center text-gray-600">
            {!isLogin ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => {
                setIsLogin((x) => !x);
              }}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              {!isLogin ? "Login" : "Signup"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Auth;
