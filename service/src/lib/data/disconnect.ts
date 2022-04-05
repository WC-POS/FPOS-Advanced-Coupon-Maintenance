import { getConnection } from "typeorm";

async function disconnect(name: "ACM" | "FPOS") {
  try {
    const conn = getConnection(name);
    if (conn.isConnected) {
      await conn.close();
    }
  } catch (err) {}
}

export default disconnect;
