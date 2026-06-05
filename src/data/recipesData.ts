export interface Recipe {
  id: string
  title: string
  category: '早餐' | '午餐' | '晚餐' | '万能'
  time: number
  calories: number
  image: string
  ingredients: string[]
  steps: string[]
}

export const recipesData: Recipe[] = [
  {
    id: '1',
    title: '香煎三文鱼配嫩时蔬',
    category: '晚餐',
    time: 15,
    calories: 320,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    ingredients: ['三文鱼', '西兰花', '胡萝卜', '柠檬'],
    steps: ['三文鱼表面抹少许盐和黑胡椒', '热锅下少许橄榄油，每面中火煎3分钟', '西兰花和胡萝卜水煮捞出', '三文鱼与蔬菜一同摆盘，挤上柠檬汁']
  },
  {
    id: '2',
    title: '牛油果鸡胸沙拉',
    category: '午餐',
    time: 15,
    calories: 380,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    ingredients: ['鸡胸肉', '牛油果', '生菜', '小番茄', '玉米粒'],
    steps: ['鸡胸肉用盐和黑胡椒腌制后煎熟切块', '牛油果去皮切块，生菜洗净撕碎', '小番茄对半切开', '所有食材放入碗中，撒上玉米粒，淋柠檬汁']
  },
  {
    id: '3',
    title: '藜麦牛油果能量碗',
    category: '午餐',
    time: 20,
    calories: 420,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    ingredients: ['藜麦', '牛油果', '菠菜', '鹰嘴豆', '圣女果'],
    steps: ['藜麦洗净煮15分钟至软糯', '菠菜焯水后过冷水沥干', '圣女果对半切开，牛油果切片', '碗中铺菠菜，放上藜麦、牛油果和圣女果', '撒上鹰嘴豆即可']
  },
  {
    id: '4',
    title: '经典燕麦水果碗',
    category: '早餐',
    time: 5,
    calories: 220,
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&q=80',
    ingredients: ['燕麦', '蓝莓', '草莓', '香蕉', '坚果'],
    steps: ['即食燕麦用牛奶或水冲泡', '铺上一层新鲜蓝莓和草莓', '撒上切片香蕉和碎坚果', '可加少许蜂蜜调味']
  },
  {
    id: '5',
    title: '日式荞麦凉面',
    category: '午餐',
    time: 15,
    calories: 280,
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&q=80',
    ingredients: ['荞麦面', '黄瓜', '葱花', '海苔', '酱油'],
    steps: ['荞麦面煮熟后过冷水沥干', '黄瓜切丝，葱花切碎', '面放碗中，摆上黄瓜丝和葱花', '撒海苔丝，蘸酱油食用']
  },
  {
    id: '6',
    title: '奶油南瓜浓汤',
    category: '万能',
    time: 25,
    calories: 180,
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80',
    ingredients: ['南瓜', '洋葱', '奶油', '鸡汤'],
    steps: ['南瓜去皮切块，洋葱切碎', '锅中融化奶油，炒香洋葱', '加入南瓜块和鸡汤煮20分钟', '用搅拌器打成浓汤', '撒少许盐和胡椒调味']
  },
  {
    id: '7',
    title: '菠菜蘑菇鸡蛋杯',
    category: '早餐',
    time: 12,
    calories: 250,
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
    ingredients: ['鸡蛋', '菠菜', '蘑菇', '芝士'],
    steps: ['菠菜洗净切碎，蘑菇切片', '模具中先放菠菜和蘑菇', '打入鸡蛋，撒上碎芝士', '烤箱180度烤10分钟']
  },
  {
    id: '8',
    title: '彩虹蔬菜沙拉',
    category: '万能',
    time: 10,
    calories: 150,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    ingredients: ['生菜', '番茄', '黄瓜', '胡萝卜', '玉米粒'],
    steps: ['生菜洗净撕成小块', '番茄黄瓜切块，胡萝卜切丝', '所有蔬菜放入大碗中', '撒上玉米粒，淋沙拉酱拌匀']
  },
  {
    id: '9',
    title: '全麦吞拿鱼三明治',
    category: '午餐',
    time: 10,
    calories: 350,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80',
    ingredients: ['全麦吐司', '金枪鱼', '生菜', '番茄'],
    steps: ['全麦吐司烤至微黄', '金枪鱼罐头沥水后捣碎', '生菜洗净，番茄切片', '吐司上依次放生菜、金枪鱼、番茄', '对角切开即可']
  },
  {
    id: '10',
    title: '番茄鸡蛋藜麦面',
    category: '晚餐',
    time: 20,
    calories: 400,
    image: '/一人食🍝番茄鸡蛋焖荞麦面🍅_2_佳饭饭女士_来自小红书网页版.jpg',
    ingredients: ['藜麦面', '鸡蛋', '番茄', '菠菜', '橄榄油'],
    steps: ['藜麦面按包装说明煮熟', '番茄去皮切块，鸡蛋炒散', '锅中放少许油，炒番茄出汁', '加入菠菜和藜麦面翻炒', '最后加入鸡蛋翻炒均匀']
  },
  {
    id: '11',
    title: '虾仁牛油果塔塔',
    category: '万能',
    time: 15,
    calories: 280,
    image: '/虾仁牛油果塔塔.jpg',
    ingredients: ['虾仁', '牛油果', '柠檬', '黄瓜', '圣女果'],
    steps: ['虾仁煮熟后去壳切丁', '牛油果去皮切块', '黄瓜切丁，圣女果对半切开', '所有食材混合', '挤入柠檬汁，少许盐调味']
  },
  {
    id: '12',
    title: '西兰花鸡肉炒饭',
    category: '晚餐',
    time: 20,
    calories: 380,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80',
    ingredients: ['鸡胸肉', '西兰花', '米饭', '鸡蛋', '葱花'],
    steps: ['鸡胸肉切丁，西兰花切小朵', '鸡蛋打散炒熟盛出', '锅中加油，先炒鸡肉至变色', '加入米饭和西兰花翻炒', '最后加入鸡蛋和葱花炒匀']
  },
  {
    id: '13',
    title: '生菜包鸡肉卷',
    category: '午餐',
    time: 15,
    calories: 300,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    ingredients: ['鸡胸肉', '生菜', '胡萝卜', '黄瓜', '紫甘蓝'],
    steps: ['鸡胸肉煮熟后撕成细丝', '胡萝卜黄瓜紫甘蓝切丝', '生菜叶洗净沥干', '用生菜叶包裹鸡肉丝和蔬菜丝', '蘸泰式甜辣酱食用']
  },
  {
    id: '14',
    title: '牛油果吐司配溏心蛋',
    category: '早餐',
    time: 10,
    calories: 320,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
    ingredients: ['全麦吐司', '牛油果', '鸡蛋', '柠檬', '黑胡椒'],
    steps: ['全麦吐司烤至金黄', '牛油果去皮压成泥，加柠檬汁', '鸡蛋煮成溏心蛋', '吐司上抹牛油果泥', '放上溏心蛋，撒黑胡椒']
  },
  {
    id: '15',
    title: '三文鱼蔬菜串',
    category: '晚餐',
    time: 20,
    calories: 290,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    ingredients: ['三文鱼', '西葫芦', '彩椒', '蘑菇'],
    steps: ['三文鱼切大块，用盐和胡椒腌制', '西葫芦、彩椒切块，蘑菇切片', '将蔬菜和三文鱼交替穿在竹签上', '烤箱200度烤15分钟', '中途翻面一次']
  },
  {
    id: '17',
    title: '番茄马铃薯沙拉',
    category: '午餐',
    time: 25,
    calories: 260,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    ingredients: ['马铃薯', '番茄', '鸡蛋', '黄瓜', '沙拉酱'],
    steps: ['马铃薯和鸡蛋分别煮熟', '马铃薯切丁，鸡蛋切块', '番茄黄瓜切块', '所有食材放入碗中', '加入低脂沙拉酱拌匀']
  },
  {
    id: '18',
    title: '燕麦南瓜饼',
    category: '早餐',
    time: 20,
    calories: 240,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&q=80',
    ingredients: ['燕麦', '南瓜', '鸡蛋', '牛奶', '肉桂粉'],
    steps: ['南瓜蒸熟压成泥', '加入燕麦、鸡蛋和牛奶搅拌', '撒少许肉桂粉调味', '平底锅小火煎至两面金黄', '配酸奶食用更佳']
  },
  {
    id: '19',
    title: '藜麦蔬菜烤蛋',
    category: '早餐',
    time: 18,
    calories: 280,
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
    ingredients: ['藜麦', '鸡蛋', '菠菜', '番茄', '芝士'],
    steps: ['藜麦煮熟铺在烤盘底', '菠菜焯水后切碎，番茄切片', '在藜麦上放菠菜和番茄', '打入鸡蛋，撒上碎芝士', '烤箱180度烤12分钟']
  },
  {
    id: '20',
    title: '凉拌鸡丝荞麦面',
    category: '午餐',
    time: 20,
    calories: 360,
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&q=80',
    ingredients: ['荞麦面', '鸡胸肉', '黄瓜', '胡萝卜', '芝麻'],
    steps: ['鸡胸肉煮熟撕成细丝', '荞麦面煮熟过冷水', '黄瓜胡萝卜切丝', '面条铺碗底，放上鸡丝和蔬菜', '撒芝麻，淋酱油和醋']
  },
  {
    id: '22',
    title: '烤南瓜沙拉',
    category: '万能',
    time: 30,
    calories: 200,
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80',
    ingredients: ['南瓜', '菠菜', '核桃', '葡萄干', '橄榄油'],
    steps: ['南瓜去皮切块，刷少许油烤20分钟', '菠菜洗净铺在碗底', '放上烤好的南瓜块', '撒核桃碎和葡萄干', '淋橄榄油和柠檬汁']
  },
  {
    id: '23',
    title: '虾仁番茄意大利面',
    category: '晚餐',
    time: 25,
    calories: 420,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80',
    ingredients: ['意面', '虾仁', '番茄', '蒜', '橄榄油'],
    steps: ['意面按包装煮熟', '番茄去皮切块，虾仁焯水', '锅中放橄榄油，蒜末爆香', '加入番茄翻炒出汁', '放入虾仁和意面炒匀']
  },
  {
    id: '24',
    title: '紫甘蓝苹果沙拉',
    category: '万能',
    time: 10,
    calories: 180,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    ingredients: ['紫甘蓝', '苹果', '胡萝卜', '葡萄干', '沙拉酱'],
    steps: ['紫甘蓝切丝泡冰水使其爽脆', '苹果去皮切丝，胡萝卜擦丝', '沥干紫甘蓝，与苹果丝胡萝卜丝混合', '撒上葡萄干', '淋入低脂沙拉酱拌匀']
  },
  {
    id: '25',
    title: '藜麦鸡胸肉碗',
    category: '午餐',
    time: 25,
    calories: 400,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    ingredients: ['藜麦', '鸡胸肉', '牛油果', '玉米粒', '番茄'],
    steps: ['藜麦煮熟沥干', '鸡胸肉煎熟后切片', '牛油果切片，番茄切块', '碗中铺藜麦，摆上鸡胸肉', '撒上玉米粒，放上牛油果和番茄']
  },
  {
    id: '26',
    title: '菠菜香蕉smoothie碗',
    category: '早餐',
    time: 5,
    calories: 260,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80',
    ingredients: ['菠菜', '香蕉', '燕麦', '牛奶', '坚果'],
    steps: ['香蕉去皮冷冻1小时', '将冷冻香蕉、菠菜、燕麦、牛奶放入搅拌机', '搅打至顺滑浓稠', '倒入碗中', '撒上坚果和椰片装饰']
  },
  {
    id: '27',
    title: '日式鸡蛋三明治',
    category: '早餐',
    time: 10,
    calories: 290,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80',
    ingredients: ['全麦吐司', '鸡蛋', '生菜', '番茄', '低脂蛋黄酱'],
    steps: ['鸡蛋煮熟捣碎', '加入低脂蛋黄酱和少许盐', '全麦吐司烤至微黄', '吐司上铺生菜和番茄片', '抹上鸡蛋酱，盖上吐司对切']
  },
  {
    id: '28',
    title: '蔬菜满满鸡肉串',
    category: '晚餐',
    time: 25,
    calories: 340,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    ingredients: ['鸡胸肉', '彩椒', '洋葱', '西葫芦', '蘑菇'],
    steps: ['鸡胸肉切大块，用盐和胡椒腌制', '彩椒、洋葱、西葫芦切块', '将蔬菜和鸡肉交替穿串', '刷少许油，烤箱200度烤18分钟', '中途翻面']
  },
  {
    id: '29',
    title: '牛油果金枪鱼沙拉',
    category: '午餐',
    time: 10,
    calories: 320,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    ingredients: ['牛油果', '金枪鱼', '生菜', '玉米粒', '圣女果'],
    steps: ['生菜洗净铺在碗底', '金枪鱼罐头沥水', '牛油果切片，圣女果对半切开', '碗中放入金枪鱼和牛油果', '撒上玉米粒和圣女果']
  },
]
