export class Publications{
  _id: any;
    constructor(
        public user : string,
        public text : string,
        public file : string,
        public created_at : string,
        public likes: any
    ){}
}
