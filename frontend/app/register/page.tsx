import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create your account
            </h1>

            <p className="mt-2 text-gray-600">
              Join LumiLearn and start learning.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}