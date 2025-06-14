import { client } from "../api/client";
import { useUserData } from "../api/hooks/user-data";
import { useGlobalStore } from "../store";

export function ProfilePage() {
  const userId = useGlobalStore((s) => s.userId);
  const [userData] = useUserData(client, userId!);

  const Field = ({ name, value }: { name?: string; value?: string }) => (
    <div className="border-b-1 border-primary-200 flex flex-col px-4 py-1">
      <p className="text-primary-200 text-sm">{name}</p>
      <p className="text-white text-lg">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col items-center p-12">
        <div className="relative">
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 bg-secondary-500 rounded-full p-4">
            <p className="text-base font-bold text-white text-center">{`${userData?.creditScore}/100`}</p>
          </div>
          <img
            className="rounded-full border-2 border-primary-500 aspect-square size-40"
            src={userData?.profilePictUrl}
          />
        </div>
      </div>
      <div className="bg-primary-500 grow rounded-t-4xl p-12 space-y-4">
        <Field name="Nama" value={userData?.name} />
        <Field name="Angkatan" value={userData?.year.toString()} />
        <Field name="E-mail" value={userData?.email} />
        <Field name="Fakultas" value={userData?.faculty} />
        <Field name="Jurusan" value={userData?.major} />
      </div>
    </div>
  );
}
