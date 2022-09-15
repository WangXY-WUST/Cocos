
import { _decorator, Component, Node, Vec3 , input , Input , EventMouse , Animation} from 'cc';
const { ccclass, property } = _decorator;


@ccclass('PlayerController')
export class PlayerController extends Component {

    // 定义动画属性
    @property({type:Animation})
    public BodyAnim:Animation | null = null;


    // 定义是否接收到跳跃指令
    private _startJump:boolean = false;
    // 每次跳跃的步长
    private _jumpStep:number = 0;
    // 当前跳跃时间
    private _curJumpTime :number = 0;
    // 每次跳跃时长
    private _jumpTime:number = 0.3;
    // 当前跳跃速度
    private _curJumpSpeed:number = 0;
    // 当前角色位置
    private _curPos:Vec3 = new Vec3()
    // 每次跳跃过程中，当前帧移动位置差
    private _deltaPos:Vec3 = new Vec3()
    // 角色目标位置
    private _targetPos:Vec3 = new Vec3()

    start(){
        /*
         * 3.0.0编辑器版本不支持input，Input ,3.4.0版本开始使用
         * input.on(type , callback , target)事件监听
         * 鼠标事件Input.EventType.MOUSE_UP
        */
        // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    // 动态开启鼠标的监听
    setInputActive(active:boolean) {
        if(active) {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }else {
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        }
    }
    // 参数类型为鼠标事件
    onMouseUp(event:EventMouse) {
        // 鼠标事件中getButton() === 0 为左键
       if(event.getButton() === 0) {
        this.jumpByStep(1)
       } 
        // 鼠标事件中getButton() === 2 为右键
        else if(event.getButton() === 2) {
        this.jumpByStep(2)
       }
    }
    jumpByStep(step:number) {
        // 接收到了跳跃指令
        if(this._startJump) {
            return
        }
        if(this.BodyAnim) {
            // 如果是一步，就是小跳
            if(step === 1) {
                // play方法立即切换到指定动画状态
                this.BodyAnim.play('oneStep')
            }
            // 如果是两步，就是大跳过去
            else if(step === 2) {
                this.BodyAnim.play('twoStep')
            }
        }
        this._startJump = true
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep/this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos , this._curPos , new Vec3(this._jumpStep , 0 , 0))
    }
    // update函数每帧执行一次，一帧的耗费时间就是增量时间deltaTime
    update(deltaTime:number) {
        if(this._startJump) {
            this._curJumpTime += deltaTime;
            // 当前跳跃时间大于每次跳跃时长,说明跳跃结束
            if(this._curJumpTime > this._jumpTime) {
                // 设置最终位置
                this.node.setPosition(this._targetPos)
                // 跳跃状态设为false
                this._startJump = false
            }
            else {
                this.node.getPosition(this._curPos)
                this._deltaPos.x = this._curJumpSpeed * deltaTime
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }
}
  