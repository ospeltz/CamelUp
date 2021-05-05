class Test {
    name;
    id;
    constructor(nm) {
        this.name = nm;
        this.id = null;
    }
    func() {
        console.log('yoo were in Test');
        console.log(this.name, this.id);
    }
}
class Test1 extends Test {
    func() {
        super.func();
        console.log('test1');
    }
}

var one = new Test('jon');
var two = new Test1('oliver');

one.func()
two.func()

console.log(one.id === undefined)