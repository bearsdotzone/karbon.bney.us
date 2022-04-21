Shader "Karbon Color/Best Shader" {
	Properties {
	_Color("Color Tint", Color) = (1.0, 1.0, 1.0, 1.0)
	_MainTex("Diffuse Texture", 2D) = "white"{}
	_BumpMap("Normal Texture", 2D) = "bump"{}
	_BumpPower ("Bump Power", Range(2.0, 0.1)) = 1.0
	_SpecColor ("Specular Color", Color) = (1.0, 1.0, 1.0, 1.0)
	_Shininess ("Shininess", Range(100.0, 0.1)) = 10.0
	_RimColor ("Rim Color", Color) = (1.0, 1.0, 1.0, 1.0)
	_RimPower ("Rim Power", Range(10.0, 0.1)) = 3.0
	}
	SubShader{
		Pass{
			Tags {"LightMode" = "ForwardBase"}
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			uniform fixed4 _Color;
			uniform fixed4 _SpecColor;
			uniform fixed4 _RimColor;
			uniform half _Shininess;
			uniform half _RimPower;
			uniform half _BumpPower;
			uniform sampler2D _MainTex;
			uniform half4 _MainTex_ST;
			uniform sampler2D _BumpMap;
			uniform half4 _BumpMap_ST;		
			uniform half4 _LightColor0;
			struct vertexInput{
				half4 vertex : POSITION;
				half3 normal : NORMAL;
				half4 texcoord : TEXCOORD0;
				half4 tangent : TANGENT;
			};
			struct vertexOutput{
				half4 pos : SV_POSITION;
				half4 tex : TEXCOORD0;
				fixed4 lightDirection : TEXCOORD1;
				fixed3 viewDirection : TEXCOORD2;
				fixed3 normalWorld : TEXCOORD3;
				fixed3 tangentWorld : TEXCOORD4;
				fixed3 binormalWorld : TEXCOORD5;
			};
			vertexOutput vert(vertexInput v){
				vertexOutput o;
				o.normalWorld = normalize(mul(half4(v.normal, 0.0), _World2Object).xyz);
				o.tangentWorld = normalize(mul(_Object2World, v.tangent).xyz);
				o.binormalWorld = normalize(cross(o.normalWorld, o.tangentWorld) * v.tangent.w);
				half4 posWorld = mul(_Object2World, v.vertex);
				o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
				o.tex = v.texcoord;
				o.viewDirection = normalize(_WorldSpaceCameraPos.xyz - posWorld.xyz);
				half3 fragmentToLightSource = _WorldSpaceLightPos0.xyz - posWorld.xyz;
				o.lightDirection = fixed4(normalize(lerp(_WorldSpaceLightPos0.xyz, fragmentToLightSource, _WorldSpaceLightPos0.w)), lerp(1.0, 1 / length(fragmentToLightSource), _WorldSpaceLightPos0.w));
				return o;
			}
			
			fixed4 frag(vertexOutput i) : COLOR {
				fixed4 tex = tex2D(_MainTex, i.tex.xy * _MainTex_ST.xy + _MainTex_ST.zw);
				fixed4 texN = tex2D(_BumpMap, i.tex.xy * _BumpMap_ST.xy + _BumpMap_ST.zw);
				fixed3 localCoords = fixed3(2.0 * texN.ag - fixed2(1.0, 1.0), _BumpPower);
				fixed3x3 local2WorldTranspose = fixed3x3(i.tangentWorld, i.binormalWorld, i.normalWorld);
				fixed3 normalDirection = normalize(mul(localCoords, local2WorldTranspose));
				fixed nDotL = saturate(dot(normalDirection, i.lightDirection.xyz));
				fixed3 diffuseReflection = i.lightDirection.w * _LightColor0.xyz * nDotL;
				fixed3 specularReflection = diffuseReflection * _SpecColor.xyz * pow(saturate(dot(reflect(-i.lightDirection.xyz, normalDirection), i.viewDirection)), _Shininess);
				fixed rim = 1 - nDotL;
				fixed3 rimLighting = nDotL * _RimColor.xyz * _LightColor0.xyz * pow(rim, _RimPower);
				fixed3 lightFinal = UNITY_LIGHTMODEL_AMBIENT.xyz + diffuseReflection + specularReflection + rimLighting;
				return fixed4(tex.xyz * lightFinal * _Color.xyz, 1.0);
			} 
			ENDCG
		}
		Pass{
			Tags {"LightMode" = "ForwardAdd"}
			Blend One One
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			uniform fixed4 _Color;
			uniform fixed4 _SpecColor;
			uniform fixed4 _RimColor;
			uniform half _Shininess;
			uniform half _RimPower;
			uniform half _BumpPower;
			uniform sampler2D _MainTex;
			uniform half4 _MainTex_ST;
			uniform sampler2D _BumpMap;
			uniform half4 _BumpMap_ST;		
			uniform half4 _LightColor0;
			struct vertexInput{
				half4 vertex : POSITION;
				half3 normal : NORMAL;
				half4 texcoord : TEXCOORD0;
				half4 tangent : TANGENT;
			};
			struct vertexOutput{
				half4 pos : SV_POSITION;
				half4 tex : TEXCOORD0;
				fixed4 lightDirection : TEXCOORD1;
				fixed3 viewDirection : TEXCOORD2;
				fixed3 normalWorld : TEXCOORD3;
				fixed3 tangentWorld : TEXCOORD4;
				fixed3 binormalWorld : TEXCOORD5;
			};
			vertexOutput vert(vertexInput v){
				vertexOutput o;
				o.normalWorld = normalize(mul(half4(v.normal, 0.0), _World2Object).xyz);
				o.tangentWorld = normalize(mul(_Object2World, v.tangent).xyz);
				o.binormalWorld = normalize(cross(o.normalWorld, o.tangentWorld) * v.tangent.w);
				half4 posWorld = mul(_Object2World, v.vertex);
				o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
				o.tex = v.texcoord;
				o.viewDirection = normalize(_WorldSpaceCameraPos.xyz - posWorld.xyz);
				half3 fragmentToLightSource = _WorldSpaceLightPos0.xyz - posWorld.xyz;
				o.lightDirection = fixed4(normalize(lerp(_WorldSpaceLightPos0.xyz, fragmentToLightSource, _WorldSpaceLightPos0.w)), lerp(1.0, 1 / length(fragmentToLightSource), _WorldSpaceLightPos0.w));
				return o;
			}
			
			fixed4 frag(vertexOutput i) : COLOR {
				fixed4 tex = tex2D(_MainTex, i.tex.xy * _MainTex_ST.xy + _MainTex_ST.zw);
				fixed4 texN = tex2D(_BumpMap, i.tex.xy * _BumpMap_ST.xy + _BumpMap_ST.zw);
				fixed3 localCoords = fixed3(2.0 * texN.ag - fixed2(1.0, 1.0), _BumpPower);
				fixed3x3 local2WorldTranspose = fixed3x3(i.tangentWorld, i.binormalWorld, i.normalWorld);
				fixed3 normalDirection = normalize(mul(localCoords, local2WorldTranspose));
				fixed nDotL = saturate(dot(normalDirection, i.lightDirection.xyz));
				fixed3 diffuseReflection = i.lightDirection.w * _LightColor0.xyz * nDotL;
				fixed3 specularReflection = diffuseReflection * _SpecColor.xyz * pow(saturate(dot(reflect(-i.lightDirection.xyz, normalDirection), i.viewDirection)), _Shininess);
				fixed rim = 1 - nDotL;
				fixed3 rimLighting = nDotL * _RimColor.xyz * _LightColor0.xyz * pow(rim, _RimPower);
				fixed3 lightFinal = diffuseReflection + specularReflection + rimLighting;
				return fixed4(lightFinal, 1.0);
			} 
			ENDCG
		}
	}
	Fallback "Specular"
}