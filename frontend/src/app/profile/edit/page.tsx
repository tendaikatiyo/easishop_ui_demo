"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCircle } from "reicon-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FieldError, ProfileSectionHeader } from "@/components/profile/profile-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoUser } from "@/hooks/use-demo-user";
import { updateUser } from "@/lib/storage";
import {
  hasProfileErrors,
  validateProfileFields,
  type ProfileFieldErrors,
} from "@/lib/profile-validation";
import { cn } from "@/lib/utils";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, refresh } = useDemoUser();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username);
    setName(user.name);
    setSurname(user.surname);
    setPhone(user.phone);
    setEmail(user.email);
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  function validateCurrent() {
    return validateProfileFields({ username, name, surname, phone, email });
  }

  function onSave() {
    setTouched(true);
    const nextErrors = validateCurrent();
    setErrors(nextErrors);
    if (hasProfileErrors(nextErrors)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    updateUser({
      username: username.trim(),
      name: name.trim(),
      surname: surname.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    refresh();
    toast.success("Profile updated");
    router.push("/profile");
  }

  function onBlurField() {
    if (!touched) return;
    setErrors(validateCurrent());
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile", href: "/profile" },
          { label: "Edit profile" },
        ]}
      />

      <section className="space-y-5 rounded-3xl bg-white p-5 md:p-6">
        <ProfileSectionHeader
          icon={UserCircle}
          title="Edit profile"
          description="Email is required — everything else is optional."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={cn(errors.email && "border-destructive")}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={onBlurField}
              placeholder="you@example.com"
            />
            <FieldError message={errors.email} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              autoComplete="username"
              aria-invalid={!!errors.username}
              className={cn(errors.username && "border-destructive")}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={onBlurField}
              placeholder="e.g. tendai"
            />
            <FieldError message={errors.username} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              autoComplete="given-name"
              aria-invalid={!!errors.name}
              className={cn(errors.name && "border-destructive")}
              onChange={(e) => setName(e.target.value)}
              onBlur={onBlurField}
            />
            <FieldError message={errors.name} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              value={surname}
              autoComplete="family-name"
              aria-invalid={!!errors.surname}
              className={cn(errors.surname && "border-destructive")}
              onChange={(e) => setSurname(e.target.value)}
              onBlur={onBlurField}
            />
            <FieldError message={errors.surname} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              className={cn(errors.phone && "border-destructive")}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={onBlurField}
              placeholder="e.g. 082 123 4567"
            />
            <FieldError message={errors.phone} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button className="rounded-full px-5" onClick={onSave}>
            Save changes
          </Button>
          <Button
            variant="ghost"
            className="rounded-full px-5"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
}
