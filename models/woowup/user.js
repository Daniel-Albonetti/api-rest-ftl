'use strict'

class User {
    constructor(userapp_id, user_id, app_id, service_uid, email, first_name, last_name, telephone, birthday, gender, document, document_type, state, city, department, address, postal_code, marital_status, tags, points, customform, club_inscription_date, blocked, notes, mailing_enabled, mailing_enabled_reason, mailing_enabled_type, mailing_enabled_updatetime, sms_enabled, sms_enabled_reason, sms_enabled_type, sms_enabled_updatetime, custom_attributes, family, createtime, updatetime, whatsapp_phone, whatsapp_id, whatsapp_validated) {
        this.userapp_id = userapp_id;
        this.user_id = user_id;
        this.app_id = app_id;
        this.service_uid = service_uid;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.telephone = telephone;
        this.birthday = birthday;
        this.gender = gender;
        this.document = document;
        this.document_type = document_type;
        this.state = state;
        this.city = city;
        this.department = department;
        this.address = address;
        this.postal_code = postal_code;
        this.marital_status = marital_status;
        this.tags = tags;
        this.points = points;
        this.customform = customform;
        this.club_inscription_date = club_inscription_date;
        this.blocked = blocked;
        this.notes = notes;
        this.mailing_enabled = mailing_enabled;
        this.mailing_enabled_reason = mailing_enabled_reason;
        this.mailing_enabled_type = mailing_enabled_type;
        this.mailing_enabled_updatetime = mailing_enabled_updatetime;
        this.sms_enabled = sms_enabled;
        this.sms_enabled_reason = sms_enabled_reason;
        this.sms_enabled_type = sms_enabled_type;
        this.sms_enabled_updatetime = sms_enabled_updatetime;
        this.custom_attributes = custom_attributes;
        this.family = family;
        this.createtime = createtime;
        this.updatetime = updatetime;
        this.whatsapp_phone = whatsapp_phone;
        this.whatsapp_id = whatsapp_id;
        this.whatsapp_validated = whatsapp_validated;
    }
    prepareUser() {
        let length = Object.keys(this).length;
        if (length <= 39) {
            const entries = Object.entries(this);
            let array = {};
            entries.forEach((item, index) => {
                let key = item[0];
                let value = item[1];
                if (value !== undefined) {
                    // console.log(`(${index}) ${key}: ${value}`);
                    array[key] = value
                }
            });
            return array;
        } else {
            throw new Error('Se agrego más parámetros')
        }
    }
}


module.exports = Object.seal(User);