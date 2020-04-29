const ar = {	'skip':'تخطي',	'1_hour':'ساعة',	'2_hour':'ساعتين',	'3_hour':'ثلاث ساعات',	'4_hour':'اربعة ساعات',	'5_hour':'خمس ساعات',	'name': 'الاسم',	'complete_data': 'قم باستكمال البيانات',	'request_sent': 'تم إرسال طلبك بنجاح',	'yes': 'نعم',	'Buy_with_visa': 'الدفع الالكتروني',	'no': 'لا',	'money_back': 'طلب استرجاع أموال',	'sign_in': 'يجب تسجيل الدخول اولآ',	'phone': 'رقم الجوال', 	'title': 'عنوان الرسالة',	'title_validation': ' قم بإدخال عنوان الرسالة',	'IdNumber_validation': 'رقم الهوية مطلوب',	'vehicleLicenses': 'صورة رخصة السياره مطلوبة',	'carImg_validation': 'صورة  السياره مطلوبة',	'phone_validation': 'رقم الجوال غير صحيح',	'password_validation': 'كلمة المرور مطلوبة',	'phoneNumber': 'رقم الجوال',	'plateNum_validation': 'رقم لوحة السيارة مطلوب',	'password': 'كلمة المرور',	'code_not_valid': 'الكود غير صحيح',	'code_validation': 'قم بإدخال كود التفعيل',	'confirm_password_validation': 'كلمة المرور غير متطابقة',	'forgetPass': 'هل نسيت كلمة المرور ؟',	'visitor': 'الدخول كزائر',	'msg_validation': 'قم بإدخال نص الرسالة',	'email_validation': 'قم بإدخال البريد الالكتروني',	'loginButton': 'تسجيل الدخول',	'checkTerms_validation': 'يجيب الموافقة علي الشروط والأحكام',	'name_validation': 'قم بإدخال إسم المستخدم',	'registerButton': 'انشاء حساب', 	'rs': 'ر.س',    'need_back': 'هل تريد الخروج ؟',    'will_need_back': 'سيتم الخروج من التطبيق .',	'open_gps': 'صلاحيات تحديد موقعك الحالي ملغاه',	'is_open_gps': 'السماح بتحديد الموقع الحالي',	'register': 'التسجيل',	'detect_location': 'تحديد الموقع',	'cannot_complete': 'لا يمكن إتمام العملية',	'sendButton': 'ارسال',	'add_places': 'إضافة مكان جديد',	'saved_places': 'الآماكن المحفوظة',	'verifyCode': 'كود التحقق',	'oldPass': 'كلمة المرور القديمة',	'newPass': 'كلمة المرور الجديدة',	'rePassword': 'تأكيد كلمة المرور',	'verifyNewPass': 'تأكيد كلمة المرور الجديدة',	'recoverPass' : 'استعادة كلمة المرور',	'confirm': 'تأكيد',	'code_co': 'رمز الكوبون',	'check_co': 'قم بإدخال الكوبون',	'activitionCode': 'كود التفعيل',	'enteractivitionCode': 'قم بإدخال كود التفعيل',	'next': 'التالي',	'dlever': 'توصيل',	'Settlement': 'تسوية الطلب',	'commis': 'عمولة',	'end_order': 'إنهاء الطلب',	'enterpassword': 'قم بإدخال كلمة المرور',	'username': 'اسم المستخدم',	'on_way': 'الطلب في الطريق',	'fullName': 'الاسم بالكامل',	'email': 'البريد الالكتروني',	'noNotifications': 'لا يوجد اشعارات',	'language': 'اللغة',	'stopNotification': 'غلق الاشعارات',	'shareApp': 'مشاركة التطبيق',	'home': 'الرئيسية',	'go_home': 'الذهاب للرئيسية',	'aboutApp': 'عن التطبيق',	'appLang': 'لغة التطبيق',	'terms' : 'الشروط والاحكام',	'copoun_required' : 'قم بإدخال الكوبون',	'contactUs' : 'تواصل معنا',	'settings' : 'الاعدادات',	'allow_location' : 'يجب السماح بتحديد الموقع',	'complaints' : 'الشكاوي والاقتراحات',	'logout' : 'تسجيل الخروج',	'resend' : 'إعادة إرسال كود التفعيل',	'notifications' : 'الاشعارات',	'notifs' : 'الاشعارات',	'notificationDeleted' : 'تم حذف الاشعار',	'search' : 'بحث',	'RS' : 'ر.س',	'choose_time' : 'عدد الساعات اللازم لتسليم الطلب',	'current' : 'الموقع الحالى',	'city' : 'المدينة',	'no_result' : 'لايوجد نتيجة',	'date' : 'التاريخ',	'time' : 'الوقت',	'cancel' : 'الغاء',	'address' : 'العنوان',	'msg' : 'الرسالة',	'changePass' : 'تغيير كلمة المرور',	'chooseLang' : 'اختر اللغة',	'passwordRequired': 'كلمة السر مطلوبه',	'phoneRequired': 'رقم الهاتف مطلوب',	'passwordLength': 'كلمة السر اقل من 6 احرف',	'phoneValidation': 'رقم الهاتف غير صحيح',	'organizations': 'الهيئات',	'available':'متاح', 	'notavailable':'غير متاح',	'verifyPassword': 'كلمة المرور و تأكيد كلمة المرور غير متطابقين',	'guest': 'زائر',	'login_guest': 'تسجيل دخول كزائر',	'codeNotCorrect' : 'كود التفعيل غير صحيح',	'emailNotCorrect': 'البريد الالكتروني غير صحيح',	'searchResult': 'نتائج البحث',	'activateAcc': 'تفعيل الحساب',	'activationCode': 'كود التفعيل',	'msgSubject': 'موضوع الرسالة',	'Select_item': 'إختيار مكان التسليم',	'Select_time': 'إختيار وقت التسليم',	'myOrders': 'طلباتي',	'specialOrders': 'طلبات خاصة',	'asUser': 'كمستخدم',	'asDelegate': 'انضم كمندوب',	'choose_saved': 'إختيار من الآماكن المحفوظة',	'profile': 'الملف الشخصي',	'login': 'تسجيل الدخول',	'reviews': 'تعليقات العملاء',	'enterOldPass': 'الرجاء ادخال كلمة المرور القديمة',	'enterNewPass': 'الرجاء ادخال كلمة المرور الجديدة',	'enterConfirmPass': 'الرجاء ادخال تأكيد كلمة المرور الجديده',	'enterUsername': 'الرجاء ادخال اسم المستخدم',	'enterPhone': 'الرجاء ادخال رقم الجوال',	'enterMail': 'الرجاء ادخال البريد الالكتروني',	'orderNum': 'رقم الطلب',	'enterMsgSubject': 'الرجاء ادخال موضوع الرسالة',	'typeMsg': 'اكتب رسالتك',	'sendMsg': 'ارسال رسالة',	'edit': 'تعديل',	'LocationName': 'إسم المكان',	'Location': 'آلأماكن المحفوظة',	'throughSocial': 'او عبر التواصل الاجتماعي',	'appPolicy': 'سياسة التطبيق',	'edit_location': 'تعديل الموقع الجغرافي',	'some_fields_required': 'بعض البيانات غير مكتملة',	'location': 'الموقع الجغرافي',	'orderDet': 'تفاصيل الطلب',	'customerInfo': 'معلومات العميل',	'paymentMethod': 'طريقة الدفع',	'deliveryDetails': 'تفاصيل التسليم',	'deliveryLocation': 'موقع التسليم',	'seeLocation': 'مشاهدة الموقع',	'deliveryTime': 'وقت التسليم',	'customerName': 'اسم العميل', 	'add_to_cart': 'تم الإضافة للسلة',	'imageTransferred': 'صورة الحوالة البنكية',	'call': 'اتصال',	'send_bank_amount': 'إرسال حوالة بنكية',	'accountName_validation': 'قم بإدخال إسم الحساب',	'accountName': 'إسم الحساب',	'bankName_validation': 'قم بإدخال إسم البنك',	'bankName': 'إسم البنك',	'set_order': 'تم التسوية',	'not_set_order': 'لم يتم التسوية',	'orders_': 'إدارة الحسابات',	'base64_validation': 'قم بإدخال صورة إيصال التحويل',	'amountTransferred_validation': 'قم بإدخال المبلغ المحول',	'accountNumber_validation': 'رقم الحساب مطلوب',	'amountTransferred': 'المبلغ المحول',	'accountNumber': 'رقم الحساب',	'orderLater': 'تابع التسوق',	'details_required': 'قم بإدخال تفاصيل الطلب',	'msgDelegate_validation': 'قم بتقييم آداء المندوب',	'msg__validation': 'قم بكتابة رأيك بالخدمه',	'starCount_validation': 'قم بتقييم المطعم',	'starCount2_validation': 'قم بتقييم المندوب',	'followOrder': 'متابعة الطلب',	'orderProcessed': 'تم تجهيز الطلب',	'orderReceived': 'قمت باستلام الطلب',	'orderHasSent': 'تم توصيل الطلب',	'orderHasReceived': 'تم استلام الطلب',	'orderInProgress': 'قيد التنفيذ',	'finishedOrders': 'طلبات منتهية',	'orders': 'الطلبات',	'deliverOrder': 'سأوصل هذا الطلب',	'delegateName': 'اسم المندوب',	'idNum': 'رقم الهوية',	'enterId': 'الرجاء ادخال رقم الهوية',	'licenseImg': 'صوره الرخصة',	'enterLicense': 'الرجاء ادخال صوره الرخصة',	'carImg': 'صوره السيارة',	'enterCarImg': 'الرجاء ادخال صوره السيارة',	'carNum': 'ارقام لوحة السيارة',	'enterCarNum': 'الرجاء ادخال ارقام لوحة السيارة',	'enterPass': 'الرجاء ادخال كلمة المرور',	'byRegister': 'بالتسجيل في التطبيق فإنك توافق علي',	'haveAcc': 'لديك حساب بالفعل ؟',	'clickHere': 'اضغط هنا',	'delivery_Location': 'موقع الإستلام',	'place_details': 'تفاصيل المطعم / الأسرة',	'back': 'رجوع',	'vehicleLicenses_validation': 'صورة رخصة السيارة مطلوبة',	'enterContractImg': 'الرجاء إدخال صوره الإستمارة',	'requiredContractImg': 'قم بإدخال صورة الإستمارة',	'contract': 'صوره الاستماره',	'dataSent': 'تم ارسال البيانات للادارة بنجاح',	'haveNoAcc': 'ليس لديك حساب ؟',	'enterVerifyCode': 'الرجاء ادخال كود التحقق',	'categories': 'الاقسام',	'restaurants': 'مطاعم',	'special_order': 'طلب خاص',	'prodFamilies': 'اسر منتجة',	'offerPrice': 'عرض السعر',	'priceProvided': 'السعر المقدم',	'accept': 'قبول',	'refuse': 'رفض',	'cancelOrder': 'الغاء الطلب',	'urReview': 'تم ارسال تقييمك بنجاح',	'addRate': 'اضف تقييمك',	'restRating': 'تقييم المطعم',	'typeComment': 'اكتب تعليقا',	'delegateRating': 'تقييم المندوب',	'userRating': 'تقييم العميل',	'evaluation': 'تقييم',	'delegateInfo': 'معلومات المندوب',	'delegateTracking': 'مشاهده تتبع المندوب',	'processOrder': 'جاري تجهيز الطلب',	'orderRecieve': 'تم تسليم الطلب للمندوب',	'dlevTime': 'برجاء تحديد وقت التوصيل',	'enterDlevLocation': 'الرجاء ادخال موقع التسليم',	'selectPay': 'برجاء تحديد طريقة الدفع',	'recievePay': 'الدفع عند الاستلام',	'byVisa': 'الدفع عن طريق الفيزا',	'byWallet': 'الدفع عن طريق المحفظة',	'byMada': 'الدفع عن طريق مدي',	'byApple': 'الدفع عن طريق Apple Pay',	'productDet': 'تفاصيل المنتج',	'extras': 'اضافات',	'optional': 'اختياري',	'requiredQuantity': 'حدد الكمية المطلوبة',	'plus': 'المجموع',	'add_copon': 'إضافة رمز الكوبون ؟',	'processing': 'جاري التوصيل',	'total': 'الاجمالي',  	'orderNow': 'اطلب الآن',	'deliveryPrice': 'سعر التوصيل',	'customerPhone': 'رقم الجوال',	'bookLater': 'حجز في وقت أخر',	'sentOrder': 'تم ارسال طلبك بنجاح',	'orderTracking': 'تتبع الطلب',	'cart': 'سلة المشتريات',	'products': 'المنتجات',	'details': 'التفاصيل',	'familyDetails': 'تفاصيل الاسرة',	'all': 'الكل',	'barbecue': 'مشويات',	'sweets': 'حلويات',	'salads': 'سلطات',	'pastry': 'معجنات',	'specialOrder': 'طلب خاص',	'drinks': 'مشروبات',	'app_present': 'عمولة التطبيق',	'needPrice': 'طلبات تحتاج لسعر',	'wallet': 'المحفظة',	'currentBalance': 'رصيدك الحالي',	'recharge': 'شحن رصيد',	'restDet': 'تفاصيل المطعم',	'enterVerify': 'الرجاء ادخال كود التفعيل المرسل عبر الجوال',	'phonelen': 'رقم الجوال لا يقل عن 9 ارقام',	'passlen': 'كلمه المرور لا تقل عن 6 حروف او ارقام',	'emailErr': 'إدخال البريد بشكل صحيح',	'counp': 'الإجمالي بعد الكبون',	'bychoice': 'السعر : على حسب الاختيار',	'big': 'كبير',	'small': 'صغير',	'size': 'الحجم',	'prices': 'السعر بعد خصم الباقة',	'choosesize': 'يجب إختيار الحجم',	'chick': 'فى حالة اضافة كوبون خصم سوف يتم ازالة خصم الباقة',	'orer': 'مكونات الطلب',	'noorer': 'لم تضاف مكونات',	'notyet': 'لم يتم توفير الدفع',	'plswait': 'إنتظر قليلآ',	'cancelorder': 'الطلبات الملغاه',	'resentorder': 'اعاده ارسال الطلب',	'followUs' : 'تابعنا علي',	'wvt' : 'ضريبه القيمه المضافه',	'clickMap' : 'السماح بتحديد الموقع الحالي لعرض الطلبات',	'newNotification' : 'تم إرسال إشعار جديد',}export default ar;