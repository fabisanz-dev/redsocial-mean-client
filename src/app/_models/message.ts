export class Message{
    constructor(
      public emitter : string,
      public receiver : string,
      public viewed : string,
      public text : string,
      public created_at : string
    ){}
}
