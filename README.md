"# IST_v1" 

需满足RESTful API设计规范 

一、原则

1.尽量符合HTTP语意，比如正确使用谓词、返回码、Content-Type等

2.URI全小写，可以用减号"-"，不能用下划线"_"

3.URI中不包含扩展名，如 .json，.do

4.返回值不二次封装

5.数据交换格式为json，避免使用xml

二、版本

放在header中：X-API-Version: v1
如果没有设置，则默认是当前最新版

三、谓词

使用以下三个谓词

•GET（SELECT）：从服务器取出资源

•POST（CREATE/UPDATE）：在服务器新建/修改资源或CRUD之外的业务操作

•DELETE（DELETE）：从服务器删除资源

| 谓词      | URL           | 说明 | 
|------------|----------------|---------|
POST   |{微服务}/api/{实体} |新增/修改单/多个实体
GET  |{微服务}/api/{实体}/{id} |查询指定ID的单个实体 
GET  |{微服务}/api/{实体}?xxx=xxx&xx=xx |根据条件查询实体列表 
DELETE |{微服务}/api/{实体}/{id} |删除指定id的实体 
DELETE |{微服务}/api/{实体}?xxx=xxx&xx=xx |根据条件删除实体列表（谨慎提供）
POST |{微服务}/api/{实体}/{业务操作} |CRUD之外的业务操作，比如支付、记账、下发等 


四、分页

为了防止大批量查询拖慢服务器，所有后台查询服务都默认按照分页实现，分页属性为 page 和 size
•page: 从 0 开始计数的页数
•size: 每页行数

为了不破坏客户端代码处理数据的一致性，返回值将分页信息放到Header中
•X-Page-TotalPages: 总页数
•X-Page-TotalElements: 总行数
•X-Page-Number: 当前第几页，从 0 开始

特殊场景下，需要返回所有数据时，可以传递一个较大等size值，比如 page=0&size=99999999 ，服务器可以根据自己的处理能力决定是否按照这个值返回，这样的设计可以最大程度上保护服务的稳定性

举例

GET {微服务}/api/{实体}?xxx=xxx&xx=xx&page=0&size=15

返回值：

HTTP/1.1 200 OK

X-Page-TotalPages: 9

X-Page-TotalElements: 123

X-Page-Number: 0


[{"id":123,"title":"blog122","content":"this is blog content"},

{"id":122,"title":"blog121","content":"this is blog content"},

{"id":109,"title":"blog108","content":"this is blog content"}]
 


五、排序

查询服务支持排序，排序属性通过 query string 传递：?sort=<field>[,desc][&sort=<field>[,desc]][...]

GET {微服务}/api/{实体}?xxx=xxx&xx=xx&sort=agencyCode&sort=accountCode,desc

 

六、返回值

不对返回值做二次封装，即：

•正常情况下，返回值直接是业务数据对象或数组

•异常情况下，按照 http status code 语意返回错误码，同时提供错误描述


说明：使用统一的crux开发框架，对于返回值和错误码不需要业务特别处理，正常情况下在 Controller 中直接返回业务数据即可，错误情况下，不管在哪里，只需要

抛出异常即可

•BusinessException：业务异常，需要直接显示给终端用户，一般是常规的业务规则校验错误，比如“余额不足”，“没有权限”、“密码错误”等

•InnerException：内部异常，不能直接显示给终端用户的，比如“xx参数不能为空”、“数据库连接超时”等

举例：

正确时

HTTP/1.1 200 OK

[{"id":123,"title":"blog122","content":"this is blog content"},

{"id":122,"title":"blog121","content":"this is blog content"}]
 

错误时

HTTP/1.1 4xx Bad Request

{

    "message":"余额不足",

    "detail":"余额不足，请确认余额"

}
 
