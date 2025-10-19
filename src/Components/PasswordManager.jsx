import React, { useEffect, useRef, useState } from "react";
import Passop from "./Passop";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordManager = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const iconRef = useRef(null);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let password = await req.json();

    // MongoDB ObjectId ko string me convert karna zaroori hai
    const fixed = password.map((p) => ({ ...p, _id: p._id.toString() }));

    console.log(fixed);
    setPasswordArray(fixed);
  };

  // ✅ Load from localStorage on mount
  useEffect(() => {
    getPasswords();
  }, []);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
    iconRef.current?.play?.();
  };

  const handleAddPassword = async () => {
    if (!form.site || !form.username || !form.password) {
      alert("⚠️ Please fill all fields");
      return;
    }

    let res = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    const newEntry = data.result; // ✅ extract actual password object

    setPasswordArray([...passwordArray, newEntry]);
    setForm({ site: "", username: "", password: "" }); // reset form

    toast("Password Saved!", {
      position: "top-center",
      theme: "dark",
      transition: Bounce,
    });
  };

  const handleDelete = async (id) => {
    let c = confirm("Do you really want to delete this password from PassOp?");
    if (c) {
      await fetch(`http://localhost:3000/${id}`, { method: "DELETE" });
      setPasswordArray(passwordArray.filter((item) => item._id !== id));

      toast("Password Deleted!", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast("🦄 Copy To Clipboard ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    });
  };

  const handleEdit = (id) => {
    const editItem = passwordArray.find((i) => i._id === id);
    if (editItem) {
      setForm(editItem); // load into form
    }
  };

  const handleUpdate = async () => {
    if (!form._id) return alert("⚠️ No item selected for update.");

    let res = await fetch(`http://localhost:3000/${form._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site: form.site,
        username: form.username,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setPasswordArray(
        passwordArray.map((item) =>
          item._id === form._id ? { ...item, ...form } : item
        )
      );
      setForm({ site: "", username: "", password: "" }); // reset
      toast("✅ Password Updated!", { position: "top-center", theme: "dark" });
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(passwordArray.map((item) => item._id)); // ✅ use _id
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("⚠️ No items selected.");
      return;
    }

    let c = confirm(
      selectedIds.length === passwordArray.length
        ? "Do you really want to delete ALL passwords?"
        : "Do you really want to delete selected passwords?"
    );

    if (c) {
      // Delete each selected ID from DB
      for (const id of selectedIds) {
        await fetch(`http://localhost:3000/${id}`, { method: "DELETE" });
      }

      const filtered = passwordArray.filter(
        (item) => !selectedIds.includes(item._id)
      );
      setPasswordArray(filtered);
      setSelectedIds([]);

      toast("Selected Passwords Deleted!", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <section
        id="password-manager"
        className="relative min-h-[90vh] flex flex-col items-center justify-start"
      >
        {/* Background */}
        <div
          className="absolute inset-0 -z-10 h-full w-full bg-white 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
        bg-[size:6rem_4rem]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />
        </div>

        {/* Heading */}
        <div className="w-[70%] mx-auto flex flex-col items-center text-center space-y-4 mt-10">
          <Passop
            pColor="text-gray-600"
            spanColor="text-green-500"
            textSize="text-4xl"
            pWeight="font-extrabold"
            spanWeight="font-light"
          />

          <p className="text-lg text-gray-600">Your Own Password Manager</p>

          {/* Input Fields */}
          <div className="w-full flex flex-col items-center space-y-6 mt-6">
            <input
              type="text"
              value={form.site}
              name="site"
              onChange={handleForm}
              className="w-full md:w-3/4 py-3 px-6 rounded-xl border border-green-800 text-green-900
                       placeholder-gray-500 focus:bg-green-100 focus:border-green-500
                       focus:outline-none transition"
              placeholder="Enter Website URL / Link ..."
            />

            <div className="flex md:flex-row flex-col w-full items-center justify-center gap-6 mt-2">
              <input
                type="text"
                value={form.username}
                name="username"
                onChange={handleForm}
                className="w-full md:w-1/2 py-3 px-6 rounded-xl border border-green-800 text-green-900
                         placeholder-gray-500 focus:bg-green-100 focus:border-green-500
                         focus:outline-none transition"
                placeholder="Enter Username"
              />

              {/* Password with toggle */}
              <div className="relative w-full md:w-1/2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  name="password"
                  onChange={handleForm}
                  className="w-full py-3 pr-12 pl-6 rounded-xl border border-green-800 text-green-900
                           placeholder-gray-500 focus:bg-green-100 focus:border-green-500
                           focus:outline-none transition"
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-green-50"
                >
                  <lord-icon
                    ref={iconRef}
                    src="https://cdn.lordicon.com/dicvhxpz.json"
                    trigger="click"
                    stroke="bold"
                    state={showPassword ? "in-reveal" : "hover-cross"}
                    className="w-10"
                  ></lord-icon>
                </button>
              </div>
            </div>
          </div>

          {/* Add Password Button */}
          <button
            onClick={form._id ? handleUpdate : handleAddPassword}
            className={`${
              form._id
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 px-6 rounded-lg transition flex
  items-center justify-center gap-3 group`}
          >
            <span className="text-2xl inline-block transition-transform duration-500 group-hover:rotate-180 group-active:rotate-[720deg]">
              {form._id ? "✎" : "+"}
            </span>
            {form._id ? "Update Password" : "Add Password"}
          </button>
        </div>

        {/* Saved Passwords */}
        <div className="w-[90%] min-h-[40vh] mx-auto mt-12">
          {/* Header with Delete button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Saved Passwords
            </h2>
            {passwordArray.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md text-sm"
              >
                {selectedIds.length === passwordArray.length
                  ? "Delete All"
                  : "Delete Selected"}
              </button>
            )}
          </div>

          {passwordArray.length === 0 ? (
            <p className="text-gray-500">No passwords saved yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-300 max-h-[40vh] overflow-y-auto">
              <table className="min-w-full table-fixed text-left">
                <thead className="bg-green-100 sticky top-0 text-gray-700 text-sm">
                  <tr>
                    <th className="py-2 px-4 text-center w-[5%]">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === passwordArray.length &&
                          passwordArray.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="py-2 px-4 w-[30%]">Website (URL)</th>
                    <th className="py-2 px-4 w-[25%]">Username</th>
                    <th className="py-2 px-4 w-[25%]">Password</th>
                    <th className="py-2 px-4 w-[15%] text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {passwordArray.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-200 hover:bg-gray-50 text-sm"
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => handleSelectOne(item._id)}
                        />
                      </td>

                      {/* Website (URL) */}
                      <td className="py-3 px-4 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={item.site}
                            target="_blank"
                            title={item.site}
                            className="text-blue-600 underline truncate max-w-[140px]"
                          >
                            {item.site}
                          </a>
                          <lord-icon
                            onClick={() => handleCopy(item.site)}
                            src="https://cdn.lordicon.com/hmpomorl.json"
                            trigger="in"
                            delay="1500"
                            state="in-unfold"
                            className="w-5 h-5 cursor-pointer flex-shrink-0"
                          ></lord-icon>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3 px-4 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="truncate max-w-[150px]"
                            title={item.username}
                          >
                            {item.username}
                          </span>
                          <lord-icon
                            onClick={() => handleCopy(item.username)}
                            src="https://cdn.lordicon.com/hmpomorl.json"
                            trigger="in"
                            delay="1500"
                            state="in-unfold"
                            className="w-5 h-5 cursor-pointer"
                          ></lord-icon>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span
                            title={item.password}
                            className="truncate max-w-[120px] block"
                          >
                            {"*".repeat(item.password.length)}
                          </span>
                          <lord-icon
                            onClick={() => handleCopy(item.password)}
                            src="https://cdn.lordicon.com/hmpomorl.json"
                            trigger="in"
                            delay="1500"
                            state="in-unfold"
                            className="w-5 h-5 cursor-pointer flex-shrink-0"
                          ></lord-icon>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 flex justify-center gap-5">
                        <lord-icon
                          onClick={() => handleEdit(item._id)}
                          src="https://cdn.lordicon.com/fikcyfpp.json"
                          trigger="hover"
                          className="w-6 h-6 cursor-pointer"
                        ></lord-icon>
                        <lord-icon
                          onClick={() => handleDelete(item._id)}
                          src="https://cdn.lordicon.com/jzinekkv.json"
                          trigger="morph"
                          state="morph-trash-in"
                          className="w-6 h-6 cursor-pointer"
                        ></lord-icon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PasswordManager;
