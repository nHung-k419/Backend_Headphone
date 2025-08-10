import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// import data from '../data/xa-phuong/'

// Lấy danh sách tỉnh/thành
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getProvinces = (req, res) => {
  const filePath = path.join(__dirname, "../data/tinh_tp.json");
  const provinces = JSON.parse(fs.readFileSync(filePath, "utf8"));
   const provincesArray = Object.values(provinces).map(item => ({
    ...item,
    Address: `${item.type} ${item.name}`
  }));
  res.json(provincesArray);
};
const getDistricts = (req, res) => {
  const provinceCode = req.params.code;
  const filePath = path.join(__dirname, `../data/quan-huyen/${provinceCode}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Không tìm thấy quận/huyện cho tỉnh này" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const provincesArray = Object.values(data);
  res.json(provincesArray);
};

// Lấy danh sách xã/phường theo mã quận/huyện
const getWards = (req, res) => {
  const districtCode = req.params.code;
  const filePath = path.join(__dirname, `../data/xa-phuong/${districtCode}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Không tìm thấy xã/phường cho quận/huyện này" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const provincesArray = Object.values(data);
  res.json(provincesArray);
};
export { getProvinces, getDistricts, getWards };
