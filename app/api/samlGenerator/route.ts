// app/api/samlGenerator/route.ts
import { Data, deflateRaw } from "pako";
import { NextResponse } from "next/server";

// 随机 ID
export const generateID = () => {
  return (
    "_" + Math.random().toString(36).substring(2) + Date.now().toString(36)
  );
};

// 当前时间 ISO 格式
export const getTimestamp = () => {
  return new Date().toISOString();
};

// 生成 SAML XML
export const generateSAMLRequestXml = ({
  id,
  issueInstant,
}: {
  id: string;
  issueInstant: string;
}) => {
  return `
    <samlp:AuthnRequest
      xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
      xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
      ID="${id}"
      Version="2.0"
      IssueInstant="${issueInstant}"
      Destination="https://login.microsoftonline.com/69857f89-851d-4f06-8114-84e781ee13e2/saml2"
      AssertionConsumerServiceURL="https://central-api.talentcloud.ai/saml2/381de5ff-1f54-44ed-ab22-9921cb8c2cb3/acs">
    <saml:Issuer>https://central-api.talentcloud.ai/saml2/381de5ff-1f54-44ed-ab22-9921cb8c2cb3/metadata</saml:Issuer>
      <samlp:NameIDPolicy AllowCreate="true" Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"/>
    </samlp:AuthnRequest>
  `.trim();
};

// 编码成 SAMLRequest
export const encodeSAMLRequest = (xml: string | Data) => {
  const deflated = deflateRaw(xml, { level: 9 });
  const base64 = Buffer.from(deflated).toString("base64");
  return encodeURIComponent(base64);
};

// 主函数
export const createSAMLRequestURL = () => {
  const id = generateID();
  const timestamp = getTimestamp();
  const xml = generateSAMLRequestXml({
    id,
    issueInstant: timestamp,
  });
  const samlRequest = encodeSAMLRequest(xml);
  const relayState = "https%3A%2F%2Flocalhost%2Fauth%2F";
  return `https://login.microsoftonline.com/69857f89-851d-4f06-8114-84e781ee13e2/saml2?SAMLRequest=${samlRequest}&RelayState=${relayState}`;
};

export async function GET() {
  try {
    const loginUrl = createSAMLRequestURL();
    if (loginUrl) {
      return NextResponse.json({ url: loginUrl }, { status: 200 });
    } else {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
