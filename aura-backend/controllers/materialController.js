const Material = require("../models/Material");
const {
  demoMaterials,
  generateId,
} = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");

const listMaterials = async (req, res) => {
  if (isDatabaseReady()) {
    const materials = await Material.find().sort({ createdAt: -1 });
    return res.json({ success: true, materials });
  }

  return res.json({ success: true, materials: demoMaterials });
};

const createMaterial = async (req, res) => {
  const { courseId, title, type, url, description, isPreview, tags } = req.body;

  if (!courseId || !title || !url) {
    return res
      .status(400)
      .json({ success: false, message: "courseId, title, and url are required" });
  }

  if (isDatabaseReady()) {
    const material = await Material.create({
      course: courseId,
      title,
      type,
      url,
      description,
      isPreview,
      tags,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({ success: true, material });
  }

  const material = {
    id: generateId("mat"),
    courseId,
    title,
    type: type || "link",
    url,
    description: description || "",
    isPreview: Boolean(isPreview),
    tags: tags || [],
    uploadedBy: String(req.user._id || req.user.id),
  };

  demoMaterials.unshift(material);

  return res.status(201).json({ success: true, material });
};

module.exports = { listMaterials, createMaterial };
