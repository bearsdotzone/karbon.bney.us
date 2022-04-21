using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour {
	public GameObject particleBoom;
	public GameObject grenadeObject;
	Vector3 mousePosInWorldSpace;
	Vector2 mousePosInGUICoords;
	Transform grenadeSpawner;
	bool jumping = false;
	RaycastHit hit;
	Rect boxy;
	Ray ray;
	
	void Start () {
		foreach (Transform child in transform) {
			if (child.name == "Grenade Spawner") {
				grenadeSpawner = child;
			}
		}
	}
	
	void FixedUpdate () {
		if(Input.GetButtonDown("Jump") && !jumping){
			GetComponent<Rigidbody>().AddForce(Vector3.up * 10, ForceMode.Impulse);
			jumping = true;
		}
		transform.Rotate(Vector3.up * Input.GetAxis("Horizontal") * 10);
		transform.Translate(Vector3.forward * Input.GetAxis("Vertical") * .25f);
	}
	
	void Update () {
		//transform.Rotate(Vector3.up * Input.GetAxis("Horizontal") * Time.deltaTime * 500);
		//transform.Translate(Vector3.forward * Input.GetAxis("Vertical") * Time.deltaTime * 20);
		if(transform.position.y < -5){
			Application.LoadLevel(Application.loadedLevel);
		}
		
		if(Input.GetMouseButtonDown(0)) {
			mousePosInGUICoords = new Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
			boxy = new Rect(Screen.width - 135, Screen.height - 135, 125, 110);
			if(!boxy.Contains(mousePosInGUICoords)){
				ray = Camera.main.GetComponent<Camera>().ScreenPointToRay(Input.mousePosition);
				if (Physics.Raycast(Camera.main.GetComponent<Camera>().transform.position, ray.direction, out hit)){
					if ( hit.transform.tag != "Player") {
						mousePosInWorldSpace = hit.point;
						if(Mathf.Abs(Vector3.Angle(transform.forward, mousePosInWorldSpace - transform.position)) < 75) {
							GameObject grenade;
							grenade = Instantiate(grenadeObject, grenadeSpawner.position, grenadeSpawner.rotation) as GameObject;
							grenade.GetComponent<Rigidbody>().AddForce(calculateBestThrowSpeed(grenadeSpawner.position, mousePosInWorldSpace, Vector3.Distance(grenadeSpawner.position, mousePosInWorldSpace) / 40), ForceMode.VelocityChange);
						}
					}	
				}
			}
		}
	}
	
	void OnCollisionEnter(Collision collision){
		if(collision.gameObject.tag == "Solid"){
			jumping = false;
		}
	}
	
	private Vector3 calculateBestThrowSpeed(Vector3 origin, Vector3 target, float timeToTarget) {
		Vector3 toTarget = target - origin;
		Vector3 toTargetXZ = toTarget;
		toTargetXZ.y = 0;
		float y = toTarget.y;
		float xz = toTargetXZ.magnitude;
		float t = timeToTarget;
		float v0y = y / t + 0.5f * Physics.gravity.magnitude * t;
		float v0xz = xz / t;
		Vector3 result = toTargetXZ.normalized;
		result *= v0xz;
		result.y = v0y;
		return result;
	}
}