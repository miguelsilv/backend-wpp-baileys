export class Message {
  private readonly author?: string;
  private readonly content: string;
  private readonly phone: string;

  constructor(props: {
    author?: string;
    content: string;
    phone: string;
  }) {
    this.author = props.author;
    this.content = props.content;
    this.phone = props.phone;
  }

  public getContent(): string {
    return this.content;
  }

  public getPhone(): string {
    let phone = this.phone.replace(/[^\d]/g, '');

    if (phone.length === 13 && phone.startsWith('55')) {
      phone = phone.slice(0, 4) + phone.slice(5);
    }

    return phone;
  }

  public getAuthor(): string {
    return this.author ?? this.getPhone();
  }

  public getPhoneFormatedFromWhatsapp(): string {
    const phone = this.getPhone();
    return `${phone}@s.whatsapp.net`;
  }

} 