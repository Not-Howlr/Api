import { Migration } from '@mikro-orm/migrations';

export class Migration20210908035055 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "chat_room" add column "name" varchar(255) null;');
  }

}
