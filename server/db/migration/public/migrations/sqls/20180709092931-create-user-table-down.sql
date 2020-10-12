/* Replace with your SQL commands */
INSERT INTO "user" (name, email, PASSWORD, status)
    VALUES ('Vincent', 'vbarrois@gmail.com', '$2a$10$8SWj.FpNuHDIXtmQe3JXB.pjzuG0x64h6jzti0vKdybojUoXR8Tt6', 'ACCEPTED');

INSERT INTO auth_group_user (user_uuid, group_uuid)
SELECT
    u.uuid,
    g.uuid
FROM
    "user" u
    JOIN auth_group g ON u.email = 'vbarrois@gmail.com'
        AND g.name = 'systemAdmin';