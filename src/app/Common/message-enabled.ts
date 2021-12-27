export class messageEnabled {
    
    public errorMsg: string = '';
    public noticeMsg: string = '';
    public warningMsg: string = '';
    
    messageClick(): void {
        this.errorMsg = '';
        this.noticeMsg = '';
        this.warningMsg = '';
    }
}