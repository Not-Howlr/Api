import { Migration } from '@mikro-orm/migrations';

export class Migration20210908032300 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_password" ("id" serial primary key, "uid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null default false, "hash" varchar(255) not null, "login_attempts" int4 not null default 0, "cooldown" timestamptz(0) null);');
    this.addSql('create index "user_password_uid_index" on "user_password" ("uid");');

    this.addSql('create table "profile" ("id" serial primary key, "uid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null default false, "username" varchar(255) not null, "email" varchar(255) not null, "password_id" int4 not null, "token_version" int4 not null default 0, "is_verified" bool not null default false);');
    this.addSql('create index "profile_uid_index" on "profile" ("uid");');
    this.addSql('create index "profile_username_index" on "profile" ("username");');
    this.addSql('alter table "profile" add constraint "profile_username_unique" unique ("username");');
    this.addSql('alter table "profile" add constraint "profile_email_unique" unique ("email");');
    this.addSql('alter table "profile" add constraint "profile_password_id_unique" unique ("password_id");');

    this.addSql('create table "chat_room" ("id" serial primary key, "uid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null default false, "unread_messages" int4 not null default 0);');
    this.addSql('create index "chat_room_uid_index" on "chat_room" ("uid");');

    this.addSql('create table "message" ("id" serial primary key, "uid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null default false, "room_id" int4 not null, "from_uid" varchar(255) not null, "to_uid" varchar(255) not null, "message_content" varchar(1000) not null, "sent" timestamptz(0) not null);');
    this.addSql('create index "message_uid_index" on "message" ("uid");');
    this.addSql('create index "message_from_uid_index" on "message" ("from_uid");');
    this.addSql('create index "message_to_uid_index" on "message" ("to_uid");');

    this.addSql('create table "profile_chat_rooms" ("profile_id" int4 not null, "chat_room_id" int4 not null);');
    this.addSql('alter table "profile_chat_rooms" add constraint "profile_chat_rooms_pkey" primary key ("profile_id", "chat_room_id");');

    this.addSql('alter table "profile" add constraint "profile_password_id_foreign" foreign key ("password_id") references "user_password" ("id") on update cascade;');

    this.addSql('alter table "message" add constraint "message_room_id_foreign" foreign key ("room_id") references "chat_room" ("id") on update cascade;');

    this.addSql('alter table "profile_chat_rooms" add constraint "profile_chat_rooms_profile_id_foreign" foreign key ("profile_id") references "profile" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "profile_chat_rooms" add constraint "profile_chat_rooms_chat_room_id_foreign" foreign key ("chat_room_id") references "chat_room" ("id") on update cascade on delete cascade;');
  }

}
