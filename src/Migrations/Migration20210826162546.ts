import { Migration } from '@mikro-orm/migrations';

export class Migration20210826162546 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "profile" ("id" serial primary key, "uid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted" bool not null default false, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "token_version" int4 not null default 0, "is_verified" bool not null default false);');
    this.addSql('create index "profile_uid_index" on "profile" ("uid");');
    this.addSql('create index "profile_username_index" on "profile" ("username");');
    this.addSql('alter table "profile" add constraint "profile_username_unique" unique ("username");');
    this.addSql('alter table "profile" add constraint "profile_email_unique" unique ("email");');
  }

}
