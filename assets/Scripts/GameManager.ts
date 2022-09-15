import { _decorator, Component, Node, Prefab, instantiate, Vec3, Game } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

// enum：枚举类型，赛道格子类型，坑或者实心,输出的Blocktype类似于对象，{0:BT_NONE , 1:BT_STONE}
enum BlockType {
    BT_NONE,
    BT_STONE
}
enum GameStatus {
    GS_INIT,
    GS_PLAYING,
    GS_END
}

@ccclass('GameManager')
export class GameManager extends Component {

    // 赛道预制,
    @property({type: Prefab})
    public cubePrfb:Prefab | null = null
    // 赛道长度
    @property
    public roadLength = 50

    // _road中push(0)代表坑，push(1)代表实心
    private _road : BlockType[] = []

    //playerCtrl关联的是PlayerController节点
    @property({type:PlayerController})
    public playerCtrl : PlayerController | null = null

    // startMenu属性关联的就是开始菜单
    @property({type:Node})
    public startMenu:Node | null = null

    // 当前
    private _curMoveIndex = 0

    
    start() {
        this.curState = GameStatus.GS_INIT
        // 生成赛道
        // this.generateRoad();
    }
    // 初始化
    init() {
        // 激活主页面,  显示主页面
        if(this.startMenu) {
            this.startMenu.active = true
        }
        // 生成赛道
        this.generateRoad();
        if(this.playerCtrl) {
            this.playerCtrl.setInputActive(false)
            this.playerCtrl.node.setPosition(Vec3.ZERO)
        }
    }

    // 点击按钮的回调
    onStartButtonClicked() {
        this.curState = GameStatus.GS_PLAYING
    }
    set curState(value:GameStatus) {
        switch(value) {
            // 是初始化状态，就进行初始化
            case GameStatus.GS_INIT:
                this.init();
                break;
            case GameStatus.GS_PLAYING:
                if(this.startMenu){
                    this.startMenu.active = false
                }
                /**
                 * 如果直接设置监听鼠标事件为true，那么点击开始的鼠标还未抬起，抬起会触发监听事件
                 * 所以这里做延迟处理
                 */
                setTimeout(() => {
                    if(this.playerCtrl) {
                        this.playerCtrl.setInputActive(true)
                    }
                }, 0.1);
                break
            case GameStatus.GS_END:
                break
        }
    }
    generateRoad() {
        // 先移除所有赛道，防止重新开始时还是旧的赛道
        this.node.removeAllChildren()
        this._road = []
        // 确保游戏运行时，人物一定站在实物上,也就是第一格一定是实心的
        this._road.push(BlockType.BT_STONE)
        // 确定赛道类型
        for(let i = 1; i < this.roadLength; i++) {
            // 如果上一格是空，这一格一定不是空
            if(this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE)
            }else {
                this._road.push(Math.floor(Math.random() * 2))
            }
        }


        // 根据赛道类型生成赛道
        for(let j = 0; j < this._road.length; j++) {
            let block : Node | null = this.spawnBlockByType(this._road[j])
            // 是否生成了赛道节点
            if(block) {
                // 生成了就把这个节点添加进赛道管理节点中
                this.node.addChild(block)
                // 设置该节点的位置
                block.setPosition(j , -1.5 , 0)
            }
        }
    }

    spawnBlockByType(type:BlockType) {
        if(!this.cubePrfb) {
            return null
        }
        let block:Node | null = null
        // 赛道类型为实路才生成
        switch(type) {
            case BlockType.BT_STONE:
                /**
                 * 为实心时，再生成节点
                 * instantiate：返回从 Prefab 实例化出新节点。
                 * */ 
                block = instantiate(this.cubePrfb)
                break
        }
        return block
    }
}

