"use client";
import React, { useState, useEffect } from "react";
import { updateUserCookie, updateMenuCookie } from "@/app/actions";
import { placeholder, URI } from "@/src/lib/const";
import { useFoodStore } from "@/src/lib/useFoodStore";
import StoreMediaPickers from "@/src/components/user-settings/StoreMediaPickers";
import StoreInfoList from "@/src/components/user-settings/StoreInfoList";
import FieldEditModal from "@/src/components/user-settings/FieldEditModal";
import SaveChangesBar from "@/src/components/user-settings/SaveChangesBar";
import PauseMenuSection from "@/src/components/user-settings/PauseMenuSection";
import QrAndShareSection from "@/src/components/user-settings/QrAndShareSection";
import {
  EditableFieldKey,
  EditStates,
  INITIAL_EDIT_STATES,
} from "@/src/components/user-settings/types";

const UserSettings = ({ user: initialUser }: { user: any }) => {
  const {
    user: storeUser,
    updateUserLocal,
    refreshPanelData,
  } = useFoodStore();

  const user =
    storeUser && storeUser.id === initialUser?.id
      ? { ...initialUser, ...storeUser }
      : initialUser;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    user?.photo || placeholder,
  );
  const [previewBackground, setPreviewBackground] = useState<string>(
    user?.cover || placeholder,
  );
  const [filePhoto, setFilePhoto] = useState<File>();
  const [fileBackground, setFileBackground] = useState<File>();
  const [description, setDescription] = useState(user?.description || "");
  const [schedule, setSchedule] = useState(user?.schedule || "");
  const [location, setLocation] = useState(user?.location || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [facebook, setFacebook] = useState(user?.facebook || "");
  const [tiktok, setTiktok] = useState(user?.tiktok || "");

  const [activeEditField, setActiveEditField] =
    useState<EditableFieldKey | null>(null);
  const [editStates, setEditStates] =
    useState<EditStates>(INITIAL_EDIT_STATES);

  const isEditing = Object.values(editStates).some((state) => state === true);

  const resetFormFromUser = () => {
    setName(user?.name || "");
    setPreviewPhoto(user?.photo || placeholder);
    setPreviewBackground(user?.cover || placeholder);
    setDescription(user?.description || "");
    setSchedule(user?.schedule || "");
    setLocation(user?.location || "");
    setPhone(user?.phone || "");
    setInstagram(user?.instagram || "");
    setFacebook(user?.facebook || "");
    setTiktok(user?.tiktok || "");
    setEditStates(INITIAL_EDIT_STATES);
    setActiveEditField(null);
  };

  useEffect(() => {
    resetFormFromUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.name,
    user?.photo,
    user?.cover,
    user?.description,
    user?.schedule,
    user?.location,
    user?.phone,
    user?.instagram,
    user?.facebook,
    user?.tiktok,
  ]);

  const setFieldValue = (field: EditableFieldKey, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "schedule":
        setSchedule(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "instagram":
        setInstagram(value);
        break;
      case "facebook":
        setFacebook(value);
        break;
      case "tiktok":
        setTiktok(value);
        break;
    }
  };

  const handleFieldChange = (field: EditableFieldKey, value: string) => {
    setFieldValue(field, value);
    setEditStates((prev) => ({ ...prev, [field]: true }));
  };

  const removeField = async (field: EditableFieldKey) => {
    if (field === "name") return;
    setLoading(true);

    const formData = new FormData();
    formData.append(field, "");
    formData.append("user_id", String(user?.id));

    try {
      const res = await fetch(`${URI}/menu/update/info/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          alert(`Error de validación: ${data.errors.join(", ")}`);
        } else {
          alert(data.message || "Ocurrió un error inesperado");
        }
        return;
      }
      if (data.success) {
        if (data.user) await updateUserCookie(data.user);
        if (data.menu) await updateMenuCookie(data.menu);

        setFieldValue(field, "");
        updateUserLocal({
          ...(typeof data.user === "object" ? data.user : {}),
          ...(typeof data.menu === "object" ? data.menu : {}),
          [field]: "",
        });
        await refreshPanelData();
        setEditStates((prev) => ({ ...prev, [field]: false }));
        setActiveEditField(null);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const photoCapture = (selectedFile: File) => {
    if (!selectedFile) return;
    setFilePhoto(selectedFile);
    setPreviewPhoto(URL.createObjectURL(selectedFile));
    setEditStates((prev) => ({ ...prev, photo: true }));
  };

  const backgroundCapture = (selectedFile: File) => {
    if (!selectedFile) return;
    setFileBackground(selectedFile);
    setPreviewBackground(URL.createObjectURL(selectedFile));
    setEditStates((prev) => ({ ...prev, cover: true }));
  };

  const userUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (filePhoto) formData.append("photo", filePhoto);
    if (fileBackground) formData.append("cover", fileBackground);
    if (editStates.name) formData.append("name", name);
    if (editStates.description) formData.append("description", description);
    if (editStates.schedule) formData.append("schedule", schedule);
    if (editStates.location) formData.append("location", location);
    if (editStates.phone) formData.append("phone", phone);
    if (editStates.instagram) formData.append("instagram", instagram);
    if (editStates.facebook) formData.append("facebook", facebook);
    if (editStates.tiktok) formData.append("tiktok", tiktok);
    formData.append("user_id", String(user?.id));

    try {
      const res = await fetch(`${URI}/menu/update/info/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          alert(`Error de validación: ${data.errors.join(", ")}`);
        } else {
          alert(data.message || "Ocurrió un error inesperado");
        }
        return;
      }
      if (data.success) {
        if (data.user) await updateUserCookie(data.user);
        if (data.menu) await updateMenuCookie(data.menu);

        const localUpdates: Record<string, any> = {};
        if (editStates.name) localUpdates.name = name;
        if (editStates.description) localUpdates.description = description;
        if (editStates.schedule) localUpdates.schedule = schedule;
        if (editStates.location) localUpdates.location = location;
        if (editStates.phone) localUpdates.phone = phone;
        if (editStates.instagram) localUpdates.instagram = instagram;
        if (editStates.facebook) localUpdates.facebook = facebook;
        if (editStates.tiktok) localUpdates.tiktok = tiktok;
        if (typeof data.user === "object")
          Object.assign(localUpdates, data.user);
        else if (typeof data.user === "string")
          localUpdates.name = data.user.replace(/"/g, "");
        if (typeof data.menu === "object")
          Object.assign(localUpdates, data.menu);

        updateUserLocal(localUpdates);
        await refreshPanelData();

        setEditStates(INITIAL_EDIT_STATES);
        setActiveEditField(null);
      }
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row overflow-x-hidden pb-16">
      {loading && (
        <div className="fixed inset-0 bg-gray-50/50 z-60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* COLUMNA IZQUIERDA: Formulario y edición */}
      <div className="w-full flex px-4 flex-col">
        <header className="p-3 w-full flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800">Tu local</h1>
          <p className="text-gray-500 text-sm">
            Edita la información de tu negocio.
          </p>
        </header>

        <form
          onSubmit={userUpdate}
          className="flex w-full mt-3 relative flex-col items-center justify-center border-b md:border-b-0 border-gray-200 pb-6"
        >
          <div className="w-full md:px-0 flex flex-col">
            <StoreMediaPickers
              previewPhoto={previewPhoto}
              previewBackground={previewBackground}
              plan={user?.plan}
              onPhotoSelect={photoCapture}
              onBackgroundSelect={backgroundCapture}
            />

            <StoreInfoList
              user={user}
              name={name}
              description={description}
              schedule={schedule}
              location={location}
              phone={phone}
              instagram={instagram}
              facebook={facebook}
              tiktok={tiktok}
              onEditField={setActiveEditField}
            />
          </div>

          <FieldEditModal
            activeField={activeEditField}
            user={user}
            loading={loading}
            values={{
              name,
              description,
              schedule,
              location,
              phone,
              instagram,
              facebook,
              tiktok,
            }}
            onClose={() => setActiveEditField(null)}
            onChangeField={handleFieldChange}
            onClearDraftField={(field) => setFieldValue(field, "")}
            onRemoveField={removeField}
          />

          <SaveChangesBar
            isEditing={isEditing}
            loading={loading}
            onCancel={resetFormFromUser}
          />
        </form>
        <div className="hidden md:block">
          <PauseMenuSection
            user={user}
            updateUserLocal={updateUserLocal}
            refreshPanelData={refreshPanelData}
          />
        </div>
      </div>

      {/* COLUMNA DERECHA (Escritorio) / ABAJO (Móvil): Sección QR y Compartir */}
      <QrAndShareSection user={user} previewPhoto={previewPhoto} />
      <div className="px-4 md:hidden">
        <PauseMenuSection
          user={user}
          updateUserLocal={updateUserLocal}
          refreshPanelData={refreshPanelData}
        />
      </div>
    </div>
  );
};

export default UserSettings;
