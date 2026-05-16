import { useState } from "react";
import { Upload, Image } from "antd";
import { PictureOutlined, UploadOutlined } from "@ant-design/icons";

type Props = {
  currentUrl?: string | null;
  onFileSelect: (file: File) => void;
};

export default function FotoUpload({ currentUrl, onFileSelect }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  const fotoAtual = previewUrl || currentUrl;

  return (
    <Upload
      accept="image/*"
      showUploadList={false}
      beforeUpload={(file) => {
        setPreviewUrl(URL.createObjectURL(file));
        onFileSelect(file);
        return false;
      }}
    >
      {fotoAtual ? (
        <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
          <Image
            src={fotoAtual}
            height={160}
            style={{ objectFit: "cover", borderRadius: 8, display: "block" }}
            preview={false}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
              color: "#fff",
              gap: 4,
            }}
            className="foto-overlay"
          >
            <UploadOutlined style={{ fontSize: 24 }} />
            <span style={{ fontSize: 12 }}>Trocar foto</span>
          </div>
          <style>{`.foto-overlay:hover { opacity: 1 !important; }`}</style>
        </div>
      ) : (
        <div
          style={{
            width: 160,
            height: 160,
            border: "2px dashed #d9d9d9",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            gap: 8,
            color: "#aaa",
            background: "#fafafa",
          }}
        >
          <PictureOutlined style={{ fontSize: 32 }} />
          <span style={{ fontSize: 13 }}>Selecionar foto</span>
        </div>
      )}
    </Upload>
  );
}
