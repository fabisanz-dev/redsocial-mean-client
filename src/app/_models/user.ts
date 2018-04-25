export class User{
    _id: any;
    gettoken: string;
    constructor(
        public name : string,
        public surname : string,
        public nick : string,
        public email : string,
        public password : string,
        public role : string, 
        public image : string
    ){}
}
