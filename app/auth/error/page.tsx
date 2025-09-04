"use client";

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Auth failed: {error.message}</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
