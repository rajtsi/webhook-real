const axios = require("axios");

const META_ENDPOINT = process.env.META_ENDPOINT;
const META_TOKEN = process.env.META_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

if (!META_ENDPOINT || !META_TOKEN || !PHONE_ID) {
    throw new Error("WhatsApp env variables missing");
}

module.exports = function (whatsapp_number, template_name, variables = []) {

    let payload = {};
    payload.to = whatsapp_number;
    payload.messaging_product = "whatsapp";
    payload.type = "template";

    let template = {};
    template.name = template_name;
    template.language = { code: "en_US" };

    let template_vars = [];
    let components = { type: "body" };

    for (let i = 0; i < variables.length; i++) {
        template_vars.push({
            type: "text",
            text: variables[i]
        });
    }

    if (template_vars.length > 0) {
        components.parameters = template_vars;
    }

    template.components = [components];
    payload.template = template;

    return axios
        .post(`${META_ENDPOINT}/${PHONE_ID}/messages`, payload, {
            headers: {
                Authorization: `Bearer ${META_TOKEN}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.data);
};