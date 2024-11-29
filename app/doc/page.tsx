"use client";
import { useDocuments } from "@/lib/useDocument"; // Using the custom hook
import DocCards from "@/components/DocCards";

const DocPage = () => {
  const { owner, editor } = useDocuments(); // Using our custom hook

  return (
    <div className="p-4 space-y-6">
      {/* My Documents Section */}
      {owner.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-700">Your Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {owner.map((doc) => (
              <DocCards
                key={doc.id}
                id={doc.id}
                href={`/doc/${doc.id}`}
                role={doc.role}
                createdAt={doc.createdAt} // Passing Timestamp
              />
            ))}
          </div>
        </>
      )}

      {/* Shared with Me Section */}
      {editor.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-700">Shared with you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {editor.map((doc) => (
              <DocCards
                key={doc.id}
                id={doc.id}
                href={`/doc/${doc.id}`}
                role={doc.role}
                createdAt={doc.createdAt} // Passing Timestamp
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DocPage;
