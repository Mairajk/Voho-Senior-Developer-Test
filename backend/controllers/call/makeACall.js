const { CallModel } = require("../../models");
const createCall = require("../../helpers/createCall");

exports.makeACall = async (req, res) => {
  const {
    tenant: { id: tenantId },
    user: { id: userId },
  } = req;

  try {
    /** Call create call helper. */
    const response = await createCall();

    await CallModel.create({
      callId: response.callId,
      userId,
      tenantId: tenantId,
    });

    res.status(201).json({ message: "Call created successfully" });
  } catch (error) {
    console.error("Error creating call:", error);
    res.status(500).json({ message: "Server error." });
  }
};
