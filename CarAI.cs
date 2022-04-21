using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class CarAI : MonoBehaviour
{
	public Vector3 centerOfMass;
	public WheelCollider dataWheel;
	public float lowestSteerAtSpeed = 50;
	public float lowSpeedSteerAngle = 10;
	public float highSpeedSteerAngle = 5;
	public float decellarationSpeed = 40;
	public float maxTorque = 50;
	public float currentSpeed;
	public float topSpeed = 275;
	public float maxReverseSpeed = 50;
	public float maxBrakeTorque = 100;
	public bool vertical = false;
	public bool horizontal = false;
	public float verticalFine = 0.0f;
	public float horizontalFine = 0.0f;
	public bool brake = false;
	public int waypointNum = 0;
	public int subWaypointNum = 0;
	public GameObject waypointHolder;
	public List<Transform> waypoints;
	public List<Transform> subWaypoints;
	public Transform activeWaypoint;
	public Transform activeSubWaypoint;
	public GameObject backLightObject;
	public Material idleLightMaterial;
	public Material brakeLightMaterial;
	public Material reverseLightMaterial;
	public int[] gearRatio = {40, 100, 160, 220, 300};
	public GameObject spark;
	public GameObject collisionSound;
	public bool braked = false;

	void Awake ()
	{
		waypoints.Clear ();
		subWaypoints.Clear ();

		foreach (GameObject c in GameObject.FindGameObjectsWithTag ("waypoint")) {
				waypoints.Add (c.GetComponent<Transform>());
		}
		InitSort ();
		foreach (Transform d in waypoints[waypointNum].GetComponentsInChildren<Transform> ()) {
			if (d.tag == "subwaypoint")
				subWaypoints.Add (d);
		}
		SortTargetsByDistance ();
	}

	void Start ()
	{
		activeWaypoint = waypoints [waypointNum];
		activeSubWaypoint = subWaypoints [subWaypointNum];
		GetComponent<Rigidbody>().centerOfMass = centerOfMass;
		StartCoroutine (CheckStuck ());
	}
	
	void AI ()
	{
		if (Vector3.Distance (transform.position, activeSubWaypoint.transform.position) < 20) {
			waypointNum++;
			activeWaypoint = waypoints [waypointNum];
			subWaypoints.Clear ();
			foreach (Transform d in waypoints[waypointNum].GetComponentsInChildren<Transform> ()) {
				if (d.tag == "subwaypoint")
					subWaypoints.Add (d);
			}
			
		}
		SortTargetsByDistance ();
		activeSubWaypoint = subWaypoints [0];
		float angle = AngleAroundAxis (transform.forward, activeSubWaypoint.transform.position - transform.position, -Vector3.left);
		
		if (Mathf.Abs (angle) < 90) {
			vertical = true;
			verticalFine = Mathf.Abs(angle) > 45 ? verticalFine / 2 : 1;
			if (Mathf.Abs (angle) > .1f) {
				horizontal = true;
				horizontalFine = angle > 0 ? -1 : 1;
			} else {
				horizontal = false;
				horizontalFine = 0.0f;
			}	
		} else {
			vertical = true;
			verticalFine = -1.0f;
			if (Mathf.Abs (angle) > .1f) {
				horizontal = true;
				horizontalFine = angle > 0 ? 1 : -1;
			} else {
				horizontal = false;
				horizontalFine = 0.0f;
			}
		}
		//activeSubWaypoint.localScale = new Vector3 (500, 500, 500);
		Debug.Log ("Headed toward waypont " + waypointNum + ", " + Vector3.Distance (transform.position, activeSubWaypoint.transform.position) + " units away, at " + angle + " degrees.");
		
	}

	public static float AngleAroundAxis (Vector3 dirA, Vector3 dirB, Vector3 axis)
	{
		dirA = dirA - Vector3.Project (dirA, axis);
		dirB = dirB - Vector3.Project (dirB, axis);
		float angle = Vector3.Angle (dirA, dirB);
		return angle * (Vector3.Dot (axis, Vector3.Cross (dirA, dirB)) < 0 ? -1 : 1);
	}

	private void InitSort ()
	{
		waypoints.Sort (delegate(Transform t1, Transform t2) 
		{
			return t1.name.CompareTo (t2.name);		
		});
	}

	private void SortTargetsByDistance ()
	{
		subWaypoints.Sort (delegate(Transform t1,Transform t2) 
		{
			return Vector3.Distance (t1.position, transform.position).CompareTo (Vector3.Distance (t2.position, transform.position));
		});
	}
	
	void Update ()
	{
		AI ();
		BackLight ();
		EngineSound ();
		CalculateSpeed ();
	}

	void FixedUpdate ()
	{
		HandBrake ();
		GetComponent<Rigidbody>().AddRelativeForce (-Vector3.up * 9.8f * (currentSpeed / topSpeed) * .05f, ForceMode.Acceleration);
		GetComponent<Rigidbody>().AddForce (-Vector3.up * 9.8f, ForceMode.Acceleration);
	}
	
	public void CalculateSpeed ()
	{
		currentSpeed = 2 * 22 / 7 * dataWheel.radius * dataWheel.rpm * 60 / 1000;
		currentSpeed = Mathf.Round (currentSpeed);
	}
	
	public void BackLight ()
	{
		if (currentSpeed > 0 && verticalFine < 0 && !braked) {
			backLightObject.GetComponent<Renderer>().material = brakeLightMaterial;
		} else if (currentSpeed < 0 && verticalFine > 0 && !braked) {
			backLightObject.GetComponent<Renderer>().material = brakeLightMaterial;
		} else if (currentSpeed < 0 && verticalFine < 0 && !braked) {
			backLightObject.GetComponent<Renderer>().material = reverseLightMaterial;
		} else if (!braked) {
			backLightObject.GetComponent<Renderer>().material = idleLightMaterial;
		}
	}
	
	public void HandBrake ()
	{
		if (brake) {
			braked = true;
		} else {
			braked = false;
		}
	}

	public void EngineSound ()
	{
		int i = 0;
		for (i = 0; i < gearRatio.Length; i++) {
			if (gearRatio [i] > currentSpeed) {
				break;
			}
		}
		float gearMinValue = 0.0f;
		float gearMaxValue = 0.0f;
		if (i == 0) {
			gearMinValue = 0;
		} else {
			gearMinValue = gearRatio [i - 1];
		}
		gearMaxValue = gearRatio [i];
		float enginePitch = ((currentSpeed - gearMinValue) / (gearMaxValue - gearMinValue)) + 1;
		GetComponent<AudioSource>().pitch = enginePitch;
	}

	public void OnCollisionEnter (Collision other)
	{
		if (other.transform != transform && other.contacts.Length != 0) {
			for (var i = 0; i < other.contacts.Length; i++) {
				Instantiate (spark, other.contacts [i].point, Quaternion.identity);
				GameObject clone = Instantiate (collisionSound, other.contacts [i].point, Quaternion.identity) as GameObject;
				clone.transform.parent = transform;
			}
		}
	}
	IEnumerator CheckStuck ()
	{
		float timer = 0;
		float resetTime = Random.value * 5 + 3;
		Vector3 lastPos = transform.position;
		while (timer<resetTime) {
			yield return null;
			timer += Time.deltaTime;	
		}
		if(Vector3.Distance(transform.position, lastPos) < 5) {
			transform.position = activeSubWaypoint.transform.position;
			transform.rotation = Quaternion.identity;
		}
		StartCoroutine (CheckStuck ());
	}

}